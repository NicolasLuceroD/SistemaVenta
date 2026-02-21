import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import { faSackDollar, faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataContext } from "../context/DataContext";

const LoginUsuario = () => {
  const [nombre_usuario, setNombreUsuario] = useState("");
  const [clave_usuario, setClaveUsuario] = useState("");
  const [usuarios, setUsuarios] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const [ingresoPlata, setIngresoPlata] = useState("");
  const [caja, setCaja] = useState([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { URL } = useContext(DataContext);

  const id_sucursal = sessionStorage.getItem("sucursalId");

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  // ✅ TRAER CAJAS
  const verlasCajas = async () => {
    try {
      const response = await axios.get(`${URL}caja/${id_sucursal}`);
      setCaja(response.data);
    } catch (error) {
      console.error("Error cargando cajas:", error);
    }
  };

  // ✅ LOGIN
  const ComprobarLogin = async () => {
    if (loading) return;

    if (!id_sucursal) {
      Swal.fire("Error", "No hay sucursal seleccionada", "error");
      return;
    }

    if (!nombre_usuario || !clave_usuario) {
      Swal.fire("Atención", "Complete usuario y clave", "warning");
      return;
    }

    try {
      setLoading(true);

      const FechaRegistro = new Date().toISOString();

      const response = await axios.post(`${URL}login/usu/post`, {
        nombre_usuario,
        clave_usuario,
        Id_sucursal: id_sucursal,
      });

      const { idUsuario, rol_usuario } = response.data;

      if (!idUsuario) throw new Error("Login inválido");

      sessionStorage.setItem("rolUsuario", rol_usuario);
      sessionStorage.setItem("idUsuario", String(idUsuario));
      sessionStorage.setItem("nombreUsuario", nombre_usuario);
      sessionStorage.setItem("FechaRegistro", FechaRegistro);

      handleShowModal1();
    } catch (error) {
      Swal.fire(
        "Ingreso inválido",
        "Usuario o contraseña incorrectos",
        "warning",
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ VALIDAR CAJA + RECUPERAR TURNO
  const comprobarLoginCaja = async () => {
    if (loading) return;

    const selectedCaja = document.getElementById("Caja").value;

    if (!selectedCaja) {
      Swal.fire("Atención", "Debe seleccionar una caja", "warning");
      return;
    }

    try {
      setLoading(true);

      const idUsuario = sessionStorage.getItem("idUsuario");

      sessionStorage.setItem("idCaja", String(selectedCaja));

      // 🔥 1️⃣ Verificar caja abierta
      const responseCaja = await axios.post(
        `${URL}plataCaja/verificarCajaAbierta`,
        {
          Id_usuario: idUsuario,
          Id_caja: selectedCaja,
        },
      );

      // 🔥 2️⃣ Verificar turno activo REAL en DB
      const responseTurno = await axios.get(
        `${URL}turno/turnoActivo/${idUsuario}/${selectedCaja}`,
      );

      if (responseTurno.data?.data) {
        sessionStorage.setItem("IdTurno", responseTurno.data.Id_turno);

        Swal.fire({
          title: "Turno recuperado",
          text: "Se detectó un turno abierto",
          icon: "info",
          timer: 2500,
        });

        handleCloseModal1();
        navigate("/testVenta", { replace: true });
        return;
      }

      // 🔥 3️⃣ Si caja abierta pero sin turno → reparar inconsistencia
      if (responseCaja.data.cajaAbierta && !responseTurno.data) {
        console.warn("⚠ Caja abierta sin turno");

        handleCloseModal1();
        handleShowModal();
        return;
      }

      // 🔥 4️⃣ Caja cerrada → pedir fondo
      handleCloseModal1();
      handleShowModal();
    } catch (error) {
      console.error("Error verificando caja:", error);
      Swal.fire("Error al verificar caja");
    } finally {
      setLoading(false);
    }
  };

  // ✅ REGISTRAR FONDO + ABRIR TURNO
  const regristroPlata = async () => {
    if (loading) return;

    const idUsuario = sessionStorage.getItem("idUsuario");
    const IdCaja = sessionStorage.getItem("idCaja");

    const monto = parseFloat(ingresoPlata);

    if (!monto || isNaN(monto) || monto <= 0) {
      Swal.fire("Atención", "Ingrese un fondo válido", "warning");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Validar que NO exista turno abierto
      const respTurnoActivo = await axios.get(
        `${URL}turno/turnoActivo/${idUsuario}/${IdCaja}`,
      );

     if (respTurnoActivo.data?.data) {
        Swal.fire("Atención", "Ya existe un turno abierto", "warning");
        return;
      }

      // 🔥 1️⃣ Registrar fondo caja
      await axios.post(`${URL}plataLogin/post`, {
        Id_usuario: idUsuario,
        Id_sucursal: id_sucursal,
        cantidadPlataLogin: monto,
        Id_caja: IdCaja,
      });

      // 🔥 2️⃣ Abrir turno
      const respTurno = await axios.post(`${URL}turno/abrirTurno`, {
        Id_usuario: idUsuario,
        Id_sucursal: id_sucursal,
        FondoCaja: monto,
        Id_caja: IdCaja,
      });

      sessionStorage.setItem("platica", String(monto));
      sessionStorage.setItem("IdTurno", respTurno.data.IdTurno);

      Swal.fire("Ingreso Correcto", "Turno abierto correctamente", "success");

      handleCloseModal();
      navigate("/testVenta", { replace: true });
    } catch (error) {
      console.error("Error apertura:", error);
      Swal.fire("Error", "No se pudo abrir el turno", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ EFECTOS
  useEffect(() => {
    if (!id_sucursal) return;
    verlasCajas();
  }, [id_sucursal]);

  useEffect(() => {
    if (!id_sucursal) return;

    axios
      .get(`${URL}usuarios/sucursal/${id_sucursal}`)
      .then((response) => setUsuarios(response.data))
      .catch((error) => console.error("Error usuarios:", error));
  }, [id_sucursal, URL]);

  return (
    <div className="fondo-loginusuario">
      {" "}
      <a className="brand-link">
        {" "}
        <span className="brand-badge">A&L</span>{" "}
        <span className="brand-text">SOFTWARE</span>{" "}
      </a>{" "}
      <MDBContainer
        fluid
        className="d-flex justify-content-center align-items-center min-vh-100"
      >
        {" "}
        <MDBRow className="w-100">
          {" "}
          <MDBCol className="d-flex justify-content-center">
            {" "}
            <MDBCard
              className="bg-white my-5"
              style={{
                borderRadius: "1rem",
                maxWidth: "500px",
                padding: "30px",
              }}
            >
              {" "}
              <MDBCardBody className="p-5 w-100 d-flex flex-column">
                {" "}
                <div className="d-flex justify-content-center">
                  {" "}
                  <h3>CHUPITO - APP</h3>{" "}
                </div>{" "}
                <br />{" "}
                <select
                  className="form-select mb-4 w-100"
                  value={nombre_usuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                >
                  {" "}
                  <option value="" disabled>
                    Seleccione usuario
                  </option>{" "}
                  {usuarios.map((usuario) => (
                    <option
                      key={usuario.Id_usuario}
                      value={usuario.nombre_usuario}
                    >
                      {" "}
                      {usuario.nombre_usuario}{" "}
                    </option>
                  ))}{" "}
                </select>{" "}
                <input
                  className="form-control mb-4 w-100"
                  type="password"
                  size="lg"
                  placeholder="Ingrese clave..."
                  value={clave_usuario}
                  onChange={(e) => setClaveUsuario(e.target.value)}
                />{" "}
                <MDBBtn
                  size="lg"
                  onClick={ComprobarLogin}
                  style={{
                    backgroundColor: "#02962eff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {" "}
                  INGRESAR{" "}
                </MDBBtn>{" "}
              </MDBCardBody>{" "}
            </MDBCard>{" "}
          </MDBCol>{" "}
        </MDBRow>{" "}
      </MDBContainer>{" "}
      {/* MODAL SELECCIONAR CAJA */}{" "}
      <Modal show={showModal1} onHide={handleCloseModal1}>
        {" "}
        <Modal.Header closeButton>
          {" "}
          <Modal.Title>SELECCIONE CAJA</Modal.Title>{" "}
        </Modal.Header>{" "}
        <Modal.Body>
          {" "}
          <h3>CAJA:</h3>{" "}
          <Form.Select aria-label="Caja" id="Caja">
            {" "}
            <option value="">Seleccione una caja</option>{" "}
            {caja.map((caj) => (
              <option key={caj.Id_caja} value={caj.Id_caja}>
                {" "}
                {caj.Id_caja}{" "}
              </option>
            ))}{" "}
          </Form.Select>{" "}
          <br />{" "}
          <Button
            onClick={comprobarLoginCaja}
            style={{
              backgroundColor: "#02962eff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {" "}
            ELEGIR{" "}
          </Button>{" "}
        </Modal.Body>{" "}
        <Modal.Footer>
          {" "}
          <Button variant="danger" onClick={handleCloseModal1}>
            {" "}
            CERRAR{" "}
          </Button>{" "}
        </Modal.Footer>{" "}
      </Modal>{" "}
      {/* MODAL DINERO EN CAJA */}{" "}
      <Modal show={showModal} onHide={handleCloseModal}>
        {" "}
        <Modal.Header closeButton>
          {" "}
          <Modal.Title>DINERO EN CAJA</Modal.Title>{" "}
        </Modal.Header>{" "}
        <Modal.Body>
          {" "}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            {" "}
            <FontAwesomeIcon
              icon={faSackDollar}
              style={{ color: "#0e7c15", fontSize: "2em" }}
            />{" "}
            <input
              className="form-control"
              type="number"
              placeholder="INGRESE LA CANTIDAD DE DINERO EN CAJA"
              onChange={(e) => setIngresoPlata(e.target.value)}
              style={{ width: "350px", marginLeft: "10px" }}
            />{" "}
          </div>{" "}
          <Button
            variant="outline-success"
            onClick={regristroPlata}
            style={{ margin: "0 auto", marginTop: "10px" }}
          >
            {" "}
            <FontAwesomeIcon
              icon={faDoorOpen}
              style={{ fontSize: "30px" }}
            />{" "}
            INGRESAR{" "}
          </Button>{" "}
        </Modal.Body>{" "}
        <Modal.Footer>
          {" "}
          <Button variant="danger" onClick={handleCloseModal}>
            {" "}
            CERRAR{" "}
          </Button>{" "}
        </Modal.Footer>{" "}
      </Modal>{" "}
    </div>
  );
};

export default LoginUsuario;
