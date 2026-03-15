import BurgerMenu from '../BurgerMenu/BurgerMenu';
import HeaderLogo from './HeaderLogo';
import HeaderControls from './HeaderControls';
import './Header.css';

interface HeaderProps {
    variant?: 'default' | 'simple';
}

const Header = ({ variant = 'default' }: HeaderProps) => {
    return (
        <header className={`header header-${variant}`} role="banner">
            <HeaderLogo />
            <HeaderControls variant={variant} />
            <BurgerMenu />
        </header>
    );
};

export default Header;
