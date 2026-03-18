'use client';

import { type ChangeEvent, useState, useId } from 'react';
import { ButtonType, type InputProps, InputType, ValidationState } from '@/interfaces/interfaces';
import { useTranslation } from 'react-i18next';
import InfoIcon from '@/assets/InfoIcon.svg';
import InfoIconError from '@/assets/InfoIconError.svg';
import ShowPassword from '@/assets/ShowPassword.svg';
import HidePassword from '@/assets/HidePassword.svg';
import SuccessIcon from '@/assets/Success.svg';
import FileIcon from '@/assets/File.svg';
import './Input.css';
import Button from '../Button/Button';

const Input = ({
    type,
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    validationState = ValidationState.IDLE,
    errorMessage,
    successMessage,
    icon,
    maxLength,
    showMaxLength = true,
    disabled = false,
    backgroundColor = 'var(--input-bg)',
    showPasswordToggle = true,
    accept,
    onFileChange,
    'data-testid': dataTestId,
}: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [fileName, setFileName] = useState<string>('');
    const { t } = useTranslation();
    const charCount = value.length;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onFileChange) {
            setFileName(file.name);
            onFileChange(file);
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const getInputType = () => {
        if (type === InputType.PASSWORD && showPasswordToggle) {
            return showPassword ? 'text' : 'password';
        }
        if (type === InputType.TEXTAREA || type === InputType.FILE) {
            return undefined;
        }
        return type;
    };

    const getStateStyle = () => {
        if (validationState === ValidationState.VALID) {
            return 'input-valid';
        }
        if (validationState === ValidationState.INVALID) {
            return 'input-invalid';
        }
        return '';
    };

    const defaultId = useId();
    const inputId = `input-${defaultId}`;

    const isOverLimit = type === InputType.TEXTAREA && maxLength && charCount > maxLength;

    if (type === InputType.FILE) {
        return (
            <div className="input-wrapper">
                {label && (
                    <label className="input-label" htmlFor={inputId}>
                        {icon && <span className="input-label-icon">{icon}</span>}
                        {label}
                    </label>
                )}

                <label
                    htmlFor={inputId}
                    className={`file-upload-area ${disabled ? 'file-upload-disabled' : ''}`}
                    style={{ backgroundColor }}
                >
                    <input
                        data-testid="input-control"
                        id={`file-input-${label}`}
                        type="file"
                        className="file-upload-input"
                        onChange={handleFileChange}
                        disabled={disabled}
                        accept={accept}
                    />
                    <div className="file-upload-content">
                        <FileIcon className="file-upload-icon" />
                        <div className="file-upload-text-area">
                            <span className="file-upload-text">
                                {fileName || placeholder || t('posts.selectFile')}
                            </span>
                            <span className="file-upload-hint">
                                {accept
                                    ? `${accept.replace(/\./g, '').toUpperCase()}, ${t('posts.fileSizeLimit')}`
                                    : t('posts.fileSizeLimit')}
                            </span>
                        </div>
                    </div>
                </label>

                {validationState === ValidationState.INVALID && errorMessage && (
                    <div
                        className="input-message input-message-error"
                        data-testid="input-error"
                        role="alert"
                    >
                        <span className="input-message-icon">
                            <InfoIconError />
                        </span>
                        {errorMessage}
                        <Button type={ButtonType.BUTTON} className="input-message-info">
                            <InfoIcon />
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="input-wrapper" data-testid={dataTestId}>
            <label className="input-label" htmlFor={inputId}>
                <span className="input-label-container">
                    <span className="input-label-icon">{icon}</span>
                    {label}
                </span>
                {validationState === ValidationState.VALID && (
                    <span className="input-check-icon">✓</span>
                )}
            </label>

            <div className={`input-container ${getStateStyle()}`}>
                {type === InputType.TEXTAREA ? (
                    <textarea
                        className="input-field input-textarea"
                        placeholder={placeholder}
                        value={value}
                        onChange={handleChange}
                        onBlur={onBlur}
                        disabled={disabled}
                        maxLength={maxLength}
                        style={{ backgroundColor }}
                        aria-invalid={validationState === ValidationState.INVALID}
                    />
                ) : (
                    <input
                        data-testid="input-control"
                        type={getInputType()}
                        className="input-field"
                        placeholder={placeholder}
                        value={value}
                        onChange={handleChange}
                        onBlur={onBlur}
                        disabled={disabled}
                        style={{ backgroundColor }}
                        aria-invalid={validationState === ValidationState.INVALID}
                    />
                )}

                <div className="input-icons">
                    {type === InputType.PASSWORD && showPasswordToggle && (
                        <Button
                            type={ButtonType.BUTTON}
                            className="input-password-toggle"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            aria-pressed={showPassword}
                        >
                            {showPassword ? <HidePassword /> : <ShowPassword />}
                        </Button>
                    )}
                </div>
            </div>

            {validationState === ValidationState.VALID && successMessage && (
                <div
                    className="input-message input-message-success"
                    data-testid="input-success"
                    role="status"
                >
                    <span className="input-message-icon">
                        <SuccessIcon />
                    </span>
                    {successMessage}
                </div>
            )}

            {validationState === ValidationState.INVALID && errorMessage && (
                <div
                    className="input-message input-message-error"
                    data-testid="input-error"
                    role="alert"
                >
                    <span className="input-message-icon">
                        <InfoIconError />
                    </span>
                    {errorMessage}
                    <Button type={ButtonType.BUTTON} className="input-message-info">
                        <InfoIcon />
                    </Button>
                </div>
            )}

            {type === InputType.TEXTAREA && maxLength && showMaxLength && (
                <div className={`input-char-count ${isOverLimit ? 'input-char-count-error' : ''}`}>
                    <span className="input-char-count-icon">
                        <InfoIcon />
                    </span>
                    {t('profile.maxTexts', { count: maxLength })}
                </div>
            )}
        </div>
    );
};

export default Input;
