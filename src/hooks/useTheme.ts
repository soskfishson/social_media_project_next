import { useContext } from 'react';
import ThemeContext from '../context/ThemeContext/ThemeContext';

const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default useTheme;
