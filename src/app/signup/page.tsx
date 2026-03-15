'use client';

import { useMemo } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import EmailIcon from '../../assets/Email.svg';
import PasswordIcon from '../../assets/Eye.svg';
import useToast from '../../hooks/useToast';
import useAuth from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { ButtonType, InputType, ToastType, ValidationState } from '@/interfaces/interfaces';
import './SignUpPage.css';

const getValidationState = (
    value: string,
    touched: boolean,
    error: string | undefined,
): ValidationState => {
    if (!touched) {
        return ValidationState.IDLE;
    }
    if (error) {
        return ValidationState.INVALID;
    }
    if (value && !error) {
        return ValidationState.VALID;
    }

    return ValidationState.IDLE;
};

const SignUpPage = () => {
    const { addToast } = useToast();
    const { register } = useAuth();
    const router = useRouter();
    const { t } = useTranslation();

    const validationSchema = useMemo(
        () =>
            Yup.object({
                email: Yup.string()
                    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('auth.emailNotValid'))
                    .required(t('auth.fillAllFields')),
                password: Yup.string()
                    .min(8, t('auth.passwordMin'))
                    .required(t('auth.fillAllFields')),
            }),
        [t],
    );

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const nameFromEmail = values.email.split('@')[0];

                await register({
                    email: values.email,
                    password: values.password,
                    firstName: nameFromEmail,
                    secondName: 'User',
                });
                router.push('/');
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to create account';
                addToast(message, ToastType.ERROR);
                console.error(error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <AuthLayout
            title={t('auth.signUpTitle')}
            subtitle={t('auth.signUpSubtitle')}
            bottomText={t('auth.alreadyHaveAccount')}
            bottomLink={{ text: t('nav.signIn'), href: '/signin' }}
        >
            <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
                <Input
                    type={InputType.EMAIL}
                    label={t('auth.email')}
                    placeholder={t('auth.emailPlaceholder')}
                    value={formik.values.email}
                    onChange={(value) => formik.setFieldValue('email', value)}
                    onBlur={() => formik.setFieldTouched('email', true)}
                    validationState={getValidationState(
                        formik.values.email,
                        !!formik.touched.email,
                        formik.errors.email,
                    )}
                    errorMessage={formik.errors.email}
                    icon={<EmailIcon />}
                    disabled={formik.isSubmitting}
                />

                <Input
                    type={InputType.PASSWORD}
                    label={t('auth.password')}
                    placeholder={t('auth.passwordPlaceholder')}
                    value={formik.values.password}
                    onChange={(value) => formik.setFieldValue('password', value)}
                    onBlur={() => formik.setFieldTouched('password', true)}
                    validationState={getValidationState(
                        formik.values.password,
                        !!formik.touched.password,
                        formik.errors.password,
                    )}
                    successMessage={t('auth.passwordStrong')}
                    errorMessage={formik.errors.password}
                    icon={<PasswordIcon />}
                    disabled={formik.isSubmitting}
                    showPasswordToggle={true}
                />

                <div className="auth-form-button-container">
                    <Button
                        label={formik.isSubmitting ? t('auth.signingUp') : t('auth.signUp')}
                        disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
                        type={ButtonType.SUBMIT}
                    />
                </div>

                <p className="auth-terms">
                    {t('auth.terms')}{' '}
                    <a href="/terms" className="auth-terms-link">
                        {t('auth.termsLink')}
                    </a>{' '}
                    {t('auth.and')}{' '}
                    <a href="/privacy" className="auth-terms-link">
                        {t('auth.privacyLink')}
                    </a>
                </p>
            </form>
        </AuthLayout>
    );
};

export default SignUpPage;
