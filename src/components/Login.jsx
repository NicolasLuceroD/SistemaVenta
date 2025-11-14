import { useEffect,useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
}
from 'mdb-react-ui-kit';
import Swal from 'sweetalert2'
import { DataContext } from '../context/DataContext';
 
const Login = () => {
  const navigate = useNavigate();
  const [nombre_sucursal, setNombre_sucursal] = useState("");
  const [clave, setClave] = useState("");


  const {sucursales, URL} = useContext(DataContext)

  console.log(sucursales)

  const comprobarLogin = () => {
    axios.post(`${URL}login/post`,{ 
      nombre_sucursal: nombre_sucursal,
      clave: clave
    })
    .then(response => {
      const sucursalId = response.data.sucursalId;
      if (sucursalId) {
        localStorage.setItem('sucursalId', sucursalId);
        localStorage.setItem('nombreSucursal', nombre_sucursal)
        navigate('/loginUsuario', { replace: true });
        Swal.fire({
          title: " <strong>Ingreso exitoso!</strong>",
          html: "<i> <strong>Datos correctos</strong>  </i>",
          icon: 'success',
          timer: 3000
        });
      } else {
        Swal.fire({
          title: " <strong>Ingreso invalido!</strong>",
          html: "<i> <strong>Usuario no asociado a una sucursal</strong>  </i>",
          icon: 'warning',
          timer: 3000
        });
      }
    })
    .catch(() => {
      Swal.fire({
        title: " <strong>Ingreso invalido!</strong>",
        html: "<i> <strong> nombre y/o contraseña incorrtectos</strong>  </i>",
        icon: 'warning',
        timer: 3000
      });
    });
  };

  
  useEffect(() => {
    
    document.body.style.backgroundColor = '#1F1F1F';

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  useEffect(() => {
    console.log('Sucursales cargadas:', sucursales);
  }, [sucursales]);

  return (
<>
<div className="fondo-login"></div>
       <MDBContainer fluid className='d-flex justify-content-center align-items-center min-vh-100'>
        <MDBRow className='w-100'>
          <MDBCol className='d-flex justify-content-center'>
            <MDBCard className='bg-white my-5' style={{ borderRadius: '1rem', maxWidth: '500px', padding: '30px' }}>
              <MDBCardBody className='p-5 w-100 d-flex flex-column'>

                <div className='d-flex justify-content-center'>
                <h2>JUANA - APP</h2>
                </div>
                <br />

                <select className='form-select mb-4 w-100' value={nombre_sucursal} onChange={(e) => setNombre_sucursal(e.target.value)}>
                  <option value='' disabled>Seleccione sucursal</option>
                  {sucursales.length === 0 ? (
                    <option disabled>Cargando sucursales...</option>
                  ) : (
                    sucursales.map(sucursal => (
                      <option key={sucursal.Id_sucursal} value={sucursal.nombre_sucursal}>{sucursal.nombre_sucursal}</option>
                    ))
                  )}
                </select>        

                <input className='form-control mb-4 w-100' placeholder='Ingrese clave...' type='password' size="lg" value={clave} onChange={(e) => setClave(e.target.value)} />

                <MDBBtn size='lg' onClick={comprobarLogin} style={{backgroundColor: '#FF914D', border: 'none', cursor: 'pointer'}}>
                  INGRESAR
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>

  );
};

export default Login;
