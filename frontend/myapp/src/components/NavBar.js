import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.css';

const NavBar = () => {
  return (
    <Navbar bg="dark" expand="lg" >
      <Container>
        <Navbar.Brand href="#home" style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: '18px', color: '#fff' }}>
          <b>US LAYOFFS VISUALIZATION</b>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default NavBar;