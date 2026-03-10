'use client';

import { Component, type ReactNode } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { ButtonType } from '@/interfaces/interfaces';
import './Button.css';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    label?: string;
    type?: ButtonType;
    children?: ReactNode;
    'data-testid'?: string;
}

class Button extends Component<ButtonProps> {
    render() {
        const { label, className, type = ButtonType.SUBMIT, children, ...otherProps } = this.props;

        const isCloseButton = type === ButtonType.CLOSE;
        let baseClass: string;
        switch (type) {
            case ButtonType.SUBMIT:
                baseClass = 'submit-button';
                break;
            case ButtonType.CLOSE:
                baseClass = 'close-button-variant';
                break;
            default:
                baseClass = '';
        }
        const htmlType = isCloseButton ? 'button' : type;
        const displayLabel = label || (isCloseButton ? '×' : '');

        return (
            <button
                data-testid={this.props['data-testid'] || 'custom-button'}
                type={htmlType}
                className={`${baseClass} ${className || ''}`}
                {...otherProps}
            >
                {children || displayLabel}
            </button>
        );
    }
}

export default Button;
