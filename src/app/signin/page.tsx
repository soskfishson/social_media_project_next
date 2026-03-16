'use client';

import { useMemo } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout/AuthLayout';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import EmailIcon from '@/assets/Email.svg';
import PasswordIcon from '@/assets/Eye.svg';
import useToast from '@/hooks/useToast';
import useAuth from '@/hooks/useAuth';
import { ButtonType, InputType, ToastType, ValidationState } from '@/interfaces/interfaces';
import { useTranslation } from 'react-i18next';
import './SignInPage.css';

const SignInPage = () => {
    const { addToast } = useToast();
    const { login } = useAuth();
    const router = useRouter();
    const { t } = useTranslation();

    const signInSchema = useMemo(
        () =>
            z.object({
                email: z
                    .string()
                    .min(1, { message: t('auth.fillAllFields') })
                    .email({ message: t('auth.emailNotValid') }),
                password: z.string().min(1, { message: t('auth.fillAllFields') }),
            }),
        [t],
    );

    type SignInFormValues = z.infer<typeof signInSchema>;

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const getValidationState = (
        error: boolean,
        isTouched: boolean,
        value: string,
    ): ValidationState => {
        if (!isTouched && !value) {
            return ValidationState.IDLE;
        }
        if (error) {
            return ValidationState.INVALID;
        }
        if (!error && value) {
            return ValidationState.VALID;
        }
        return ValidationState.IDLE;
    };

    const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
        try {
            await login({ email: data.email, password: data.password });
            addToast(t('toast.successSignedIn'), ToastType.SUCCESS);
            router.push('/');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '';
            addToast(
                `${t('toast.failedSignIn')}${errorMessage ? ` ${errorMessage}` : ''} ${t('auth.tryAgain')}`,
                ToastType.ERROR,
            );
        }
    };

    const onInvalid = () => {
        addToast(t('auth.checkFields'), ToastType.ERROR);
    };

    return (
        <AuthLayout
            title={t('auth.signInTitle')}
            subtitle={t('auth.signInSubtitle')}
            bottomText={t('auth.forgotToCreate')}
            bottomLink={{ text: t('nav.signUp'), href: '/signup' }}
        >
            <form className="auth-form" onSubmit={handleSubmit(onSubmit, onInvalid)}>
                <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Input
                            type={InputType.EMAIL}
                            label={t('auth.email')}
                            placeholder={t('auth.emailPlaceholder')}
                            value={field.value}
                            onChange={field.onChange}
                            validationState={getValidationState(
                                !!fieldState.error,
                                fieldState.isTouched,
                                field.value,
                            )}
                            errorMessage={fieldState.error?.message || t('auth.emailNotValid')}
                            icon={<EmailIcon />}
                            disabled={isSubmitting}
                        />
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Input
                            type={InputType.PASSWORD}
                            label={t('auth.password')}
                            placeholder={t('auth.passwordPlaceholder')}
                            value={field.value}
                            onChange={field.onChange}
                            validationState={getValidationState(
                                !!fieldState.error,
                                fieldState.isTouched,
                                field.value,
                            )}
                            successMessage={t('auth.passwordCorrect')}
                            errorMessage={fieldState.error?.message || t('auth.tryAgain')}
                            icon={<PasswordIcon />}
                            disabled={isSubmitting}
                            showPasswordToggle={true}
                        />
                    )}
                />

                <div className="auth-form-button-container">
                    <Button
                        label={isSubmitting ? t('auth.signingIn') : t('auth.signIn')}
                        disabled={isSubmitting}
                        type={ButtonType.SUBMIT}
                    />
                </div>
            </form>
        </AuthLayout>
    );
};

export default SignInPage;
