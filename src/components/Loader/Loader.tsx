import './Loader.css';

interface LoaderProps {
    fullPage?: boolean;
    size?: 'small' | 'medium' | 'large';
    message?: string;
}

const Loader = ({ fullPage = false, size = 'medium', message }: LoaderProps) => {
    return (
        <div className={`loader-wrapper ${fullPage ? 'loader-full-page' : ''}`}>
            <div className={`loader-spinner loader-${size}`} />
            {message && <span className="loader-message">{message}</span>}
        </div>
    );
};

export default Loader;
