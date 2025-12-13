import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const { t } = useLanguage();

  return (
    <Nav className='justify-content-center mb-4'>
      <Nav.Item>
        {step1 ? (
          <Nav.Link as={Link} to='/login'>
            {t.login}
          </Nav.Link>
        ) : (
          <Nav.Link disabled>{t.login}</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <Nav.Link as={Link} to='/shipping'>
            {t.shipping}
          </Nav.Link>
        ) : (
          <Nav.Link disabled>{t.shipping}</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <Nav.Link as={Link} to='/payment'>
            {t.payment}
          </Nav.Link>
        ) : (
          <Nav.Link disabled>{t.payment}</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <Nav.Link as={Link} to='/placeorder'>
            {t.placeOrder}
          </Nav.Link>
        ) : (
          <Nav.Link disabled>{t.placeOrder}</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
