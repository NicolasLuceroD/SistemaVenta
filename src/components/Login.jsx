import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from 'mdb-react-ui-kit';
import Swal from 'sweetalert2';
import { DataContext } from '../context/DataContext';

const Login = () => {
  const navigate = useNavigate();
  const [nombre_sucursal, setNombre_sucursal] = useState("");
  const [clave, setClave] = useState("");

  const { sucursales, URL } = useContext(DataContext);

  const comprobarLogin = () => {
    axios.post(`${URL}login/post`, {
      nombre_sucursal,
      clave
    })
    .then(response => {
      const sucursalId = response.data.sucursalId;

      if (sucursalId) {
        sessionStorage.clear();
        sessionStorage.setItem('sucursalId', String(sucursalId));
        sessionStorage.setItem('nombreSucursal', nombre_sucursal);

        navigate('/loginUsuario', { replace: true });

        Swal.fire({
          title: "<strong>Ingreso exitoso!</strong>",
          html: "<i><strong>Datos correctos</strong></i>",
          icon: 'success',
          timer: 3000
        });
      } else {
        Swal.fire({
          title: "<strong>Ingreso inválido!</strong>",
          html: "<i><strong>Sucursal inválida</strong></i>",
          icon: 'warning',
          timer: 3000
        });
      }
    })
    .catch(() => {
      Swal.fire({
        title: "<strong>Ingreso inválido!</strong>",
        html: "<i><strong>Nombre y/o contraseña incorrectos</strong></i>",
        icon: 'warning',
        timer: 3000
      });
    });
  };

  useEffect(() => {
    console.log('Sucursales cargadas:', sucursales);
  }, [sucursales]);

  return (
    <div className='fondo-loginsucursales'>
      <a className="brand-link">
        <span className="brand-badge">A&L</span>
        <span className="brand-text">SOFTWARE</span>
      </a>

      <MDBContainer fluid className='d-flex justify-content-center align-items-center min-vh-100'>
        <MDBRow className='w-100'>
          <MDBCol className='d-flex justify-content-center'>
            <MDBCard className='bg-white my-5' style={{ borderRadius: '1rem', maxWidth: '500px', padding: '30px' }}>
              <MDBCardBody className='p-5 w-100 d-flex flex-column'>
                <div className='d-flex justify-content-center'>
                  <h3>CHUPITO - APP</h3>
                </div>

                <br />

                <select
                  className='form-select mb-4 w-100'
                  value={nombre_sucursal}
                  onChange={(e) => setNombre_sucursal(e.target.value)}
                >
                  <option value='' disabled>Seleccione sucursal</option>
                  {sucursales.length === 0 ? (
                    <option disabled>Cargando sucursales...</option>
                  ) : (
                    sucursales.map(sucursal => (
                      <option key={sucursal.Id_sucursal} value={sucursal.nombre_sucursal}>
                        {sucursal.nombre_sucursal}
                      </option>
                    ))
                  )}
                </select>

                <input
                  className='form-control mb-4 w-100'
                  placeholder='Ingrese clave...'
                  type='password'
                  size="lg"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                />

                <MDBBtn
                  size='lg'
                  onClick={comprobarLogin}
                  style={{ backgroundColor: '#02962eff', border: 'none', cursor: 'pointer' }}
                >
                  INGRESAR
                </MDBBtn>

              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default Login;
