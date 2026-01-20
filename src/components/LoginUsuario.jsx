/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from 'mdb-react-ui-kit';
import { faSackDollar, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataContext } from '../context/DataContext';

const LoginUsuario = () => {
  const [nombre_usuario, setNombreUsuario] = useState("");
  const [clave_usuario, setClaveUsuario] = useState("");
  const [usuarios, setUsuarios] = useState([]);

  const [showModal, setShowModal] = useState(false);   // dinero en caja
  const [showModal1, setShowModal1] = useState(false); // seleccionar caja

  const [ingresoPlata, setIngresoPlata] = useState(0);
  const [caja, setCaja] = useState([]);

  const navigate = useNavigate();
  const { URL } = useContext(DataContext);

  // ✅ Leer sucursal desde sessionStorage
  const id_sucursal = sessionStorage.getItem("sucursalId");

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const verlasCajas = () => {
    axios.get(`${URL}caja/${id_sucursal}`).then((response) => {
      setCaja(response.data);
    });
  };

  const ComprobarLogin = () => {
    if (!id_sucursal) {
      Swal.fire("Error", "No hay sucursal seleccionada. Volvé a ingresar por sucursal.", "error");
      return;
    }
    const FechaRegistro = new Date().toISOString();
    axios.post(`${URL}login/usu/post`, {
      nombre_usuario,
      clave_usuario,
      Id_sucursal: id_sucursal
    })
    .then((response) => {
      const idUsuario = response.data.idUsuario;
      const rol_usuario = response.data.rol_usuario;
      if (rol_usuario && idUsuario) {
        sessionStorage.setItem('rolUsuario', rol_usuario);
        sessionStorage.setItem('idUsuario', String(idUsuario));
        sessionStorage.setItem('nombreUsuario', nombre_usuario);
        sessionStorage.setItem('FechaRegistro', FechaRegistro);
        handleShowModal1();
      } else {
        Swal.fire({
          title: "<strong>Ingreso inválido!</strong>",
          html: "<i><strong>Usuario no asociado a la sucursal</strong></i>",
          icon: 'warning',
          timer: 3000
        });
      }
    })
    .catch(() => {
      Swal.fire({
        title: "<strong>Ingreso inválido!</strong>",
        html: "<i><strong>Usuario y/o contraseña incorrectos</strong></i>",
        icon: 'warning',
        timer: 3000
      });
    });
  };

  const comprobarLoginCaja = async () => {
    const selectedCaja = document.getElementById('Caja').value;
    if (!selectedCaja) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar una caja antes de ingresar',
        timerProgressBar: true,
        timer: 2500
      });
      return;
    }

    try {
      const idUsuario = sessionStorage.getItem('idUsuario');

      const response = await axios.post(`${URL}plataCaja/verificarCajaAbierta`, {
        Id_usuario: idUsuario,
        Id_caja: selectedCaja
      });

      // ✅ Guardar caja SIEMPRE en sessionStorage
      sessionStorage.setItem('idCaja', String(selectedCaja));

      if (response.data.cajaAbierta) {
        sessionStorage.setItem('platica', String(response.data.montoInicial));

        Swal.fire({
          title: "Caja Abierta",
          text: `Se recuperó el monto inicial de $${response.data.montoInicial}`,
          icon: "success",
          timer: 3000
        });

        handleCloseModal1();
        navigate('/testVenta', { replace: true });
      } else {
        handleCloseModal1();
        handleShowModal();
      }
    } catch (error) {
      console.error("Error al verificar la caja:", error);
      Swal.fire("Error al verificar la caja.");
    }
  };

  const regristroPlata = async () => {
  const idUsuario = sessionStorage.getItem("idUsuario");
  const IdCaja = sessionStorage.getItem("idCaja");

  if (!ingresoPlata || isNaN(ingresoPlata) || ingresoPlata <= 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: 'Debe ingresar un fondo de caja',
      timer: 2500,
      timerProgressBar: true
    });
    return;
  }
  try {
    await axios.post(`${URL}plataLogin/post`, {
      Id_usuario: idUsuario,
      Id_sucursal: id_sucursal,
      cantidadPlataLogin: parseFloat(ingresoPlata),
      Id_caja: IdCaja
    });
    sessionStorage.setItem('platica', String(ingresoPlata));
    const respTurno = await axios.post(`${URL}turno/abrirTurno`, {
      Id_usuario: idUsuario,
      Id_sucursal: id_sucursal,
      FondoCaja: ingresoPlata,
      Id_caja: IdCaja,
    });
    const IdTurno = respTurno.data.IdTurno;
    sessionStorage.setItem('IdTurno', IdTurno);
    Swal.fire({
      title: "Ingreso Correcto",
      text: "¡Que tenga un día exitoso!",
      icon: "success",
      timer: 3000
    });
    handleCloseModal();
    navigate('/testVenta', { replace: true });
  } catch (error) {
    console.error("Error al registrar el ingreso:", error);
    Swal.fire("Error al registrar la apertura de caja.");
  }
};


  useEffect(() => {
    if (!id_sucursal) return;
    verlasCajas();
  }, [id_sucursal]);

  useEffect(() => {
    if (!id_sucursal) return;

    axios.get(`${URL}usuarios/sucursal/${id_sucursal}`)
      .then(response => setUsuarios(response.data))
      .catch(error => console.error('Error fetching usuarios:', error));
  }, [id_sucursal, URL]);




  return (
    <div className='fondo-loginusuario'>
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
                  value={nombre_usuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                >
                  <option value='' disabled>Seleccione usuario</option>
                  {usuarios.map(usuario => (
                    <option key={usuario.Id_usuario} value={usuario.nombre_usuario}>
                      {usuario.nombre_usuario}
                    </option>
                  ))}
                </select>

                <input
                  className='form-control mb-4 w-100'
                  type='password'
                  size="lg"
                  placeholder='Ingrese clave...'
                  value={clave_usuario}
                  onChange={(e) => setClaveUsuario(e.target.value)}
                />

                <MDBBtn
                  size='lg'
                  onClick={ComprobarLogin}
                  style={{ backgroundColor: '#02962eff', border: 'none', cursor: 'pointer' }}
                >
                  INGRESAR
                </MDBBtn>

              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {/* MODAL SELECCIONAR CAJA */}
      <Modal show={showModal1} onHide={handleCloseModal1}>
        <Modal.Header closeButton>
          <Modal.Title>SELECCIONE CAJA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>CAJA:</h3>
          <Form.Select aria-label="Caja" id="Caja">
            <option value="">Seleccione una caja</option>
            {caja.map((caj) => (
              <option key={caj.Id_caja} value={caj.Id_caja}>
                {caj.Id_caja}
              </option>
            ))}
          </Form.Select>

          <br />

          <Button
            onClick={comprobarLoginCaja}
            style={{ backgroundColor: '#02962eff', border: 'none', cursor: 'pointer' }}
          >
            ELEGIR
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseModal1}>
            CERRAR
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL DINERO EN CAJA */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>DINERO EN CAJA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <FontAwesomeIcon icon={faSackDollar} style={{ color: '#0e7c15', fontSize: '2em' }} />
            <input
              className="form-control"
              type="number"
              placeholder="INGRESE LA CANTIDAD DE DINERO EN CAJA"
              onChange={(e) => setIngresoPlata(e.target.value)}
              style={{ width: '350px', marginLeft: '10px' }}
            />
          </div>

          <Button variant="outline-success" onClick={regristroPlata} style={{ margin: '0 auto', marginTop: '10px' }}>
            <FontAwesomeIcon icon={faDoorOpen} style={{ fontSize: '30px' }} /> INGRESAR
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseModal}>
            CERRAR
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoginUsuario;
