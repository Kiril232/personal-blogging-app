import { ReactComponent as LogoIpsum } from './logoipsum.svg';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Header.css';
export default function Header(){
    return (
        <div>
            <LogoIpsum className='logo'/>
            <FontAwesomeIcon className="user-icon" icon={faCircleUser} size="2xl"/>
        </div>
    );
}