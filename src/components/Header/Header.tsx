import BurgerMenu from '../BurgerMenu/BurgerMenu';
import HeaderLogo from './HeaderLogo';
import HeaderRightSide from './HeaderRightSide';
import './Header.css';

interface HeaderProps {
    variant?: 'default' | 'simple';
}

const Header = ({ variant = 'default' }: HeaderProps) => {
    return (
        <header className={`header header-${variant}`} role="banner">
            <HeaderLogo />
            <HeaderRightSide variant={variant} />
            <BurgerMenu />
        </header>
    );
};

export default Header;
