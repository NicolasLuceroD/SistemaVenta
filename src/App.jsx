import { useNavigate } from "react-router-dom";
import "./App.css";
import { Button, Navbar, Modal } from "react-bootstrap";
import axios from "axios";
import { MDBInputGroup } from "mdb-react-ui-kit";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faArrowRightArrowLeft,
  faCreditCard,
  faDoorOpen,
  faHandHoldingUsd,
  faMobileAlt,
  faUser,
  faWallet,
  faDollar,
  faSmoking
} from "@fortawesome/free-solid-svg-icons";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { DataContext } from "./context/DataContext";
import Dropdown from "react-bootstrap/Dropdown";
import Swal from "sweetalert2";

function App() {
  const [cantidadPlataCaja, setCantidadPlataCaja] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [time, setTime] = useState(new Date());
  const [total_cierre, setTotalCierre] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [metoPago, setMetodosPagos] = useState([]);

  const [plataApertura, setPlataApertura] = useState(0);
  const [plataIngreso, setPlataIngreso] = useState(0);
  const [plataEgreso, setPlataEgreso] = useState(0);

  const { URL } = useContext(DataContext);

  const rolUsuario = sessionStorage.getItem("rolUsuario");
  const id_sucursal = sessionStorage.getItem("sucursalId");
  const id_usuario = sessionStorage.getItem("idUsuario");
  const IdCaja = sessionStorage.getItem("idCaja");
  const nombreUsuario = sessionStorage.getItem("nombreUsuario");
  const nombreSucursal = sessionStorage.getItem("nombreSucursal");
  const IdTurno = sessionStorage.getItem("IdTurno");

  const navigate = useNavigate();

  const navegar = (ruta) => {
    navigate(ruta);
  };

  const norm = (s) => (s || "").trim().toLowerCase();

  const verMetoPagos = async () => {
    try {
      const resp = await axios.get(`${URL}plataCaja/verMetodosPagos/${IdCaja}/${id_usuario}`);
      setMetodosPagos(resp.data);
      return resp.data;
    } catch (error) {
      console.log("Error al obtener los metodos de pago", error);
      setMetodosPagos([]);
      return [];
    }
  };

  const obtenerDatosCaja = async () => {
    try {
      const response = await axios.get(`${URL}plataCaja/plataLogin/${id_usuario}/${IdCaja}`);
      if (response.data?.length) {
        setTotalCierre(parseFloat(response.data[0].total_cierre) || 0);
        setPlataApertura(parseFloat(response.data[0].montoInicial) || 0);
        setPlataEgreso(parseFloat(response.data[0].total_egresos) || 0);
        setPlataIngreso(parseFloat(response.data[0].total_ingresos) || 0);
      }
    } catch (error) {
      console.error("Error al obtener datos de caja:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleShowModal = async () => {
    setShowModal(true);
    await obtenerDatosCaja();
    await verMetoPagos();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCantidadPlataCaja("");
  };

  const calcularFaltante = () => {
    const caja = parseFloat(cantidadPlataCaja || 0);
    const diferencia = parseFloat((total_cierre - caja).toFixed(2));
    return Math.max(diferencia, 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS"
    }).format(Number(value || 0));
  };

  const cerrarCaja = async () => {
    const plataIF = parseFloat(parseFloat(cantidadPlataCaja || 0).toFixed(2));

    const pad = (n) => String(n).padStart(2, "0");
    const d = new Date();
    const fechaRegistro =
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
      `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

    if (isNaN(plataIF) || plataIF < 0) {
      return alert("Por favor ingrese un monto válido.");
    }

    try {
      // ✅ Traigo métodos actualizados ANTES de cerrar
      const metodosActualizados = await verMetoPagos();

      const getTotalExact = (name) =>
        parseFloat(metodosActualizados.find((x) => norm(x.tipo_item) === norm(name))?.total || 0);

      const getTotalContains = (fragment) =>
        parseFloat(
          metodosActualizados.find((x) => norm(x.tipo_item).includes(norm(fragment)))?.total || 0
        );

      const efectivo = getTotalExact("efectivo");
      const transferencia = getTotalExact("transferencia");
      const cigarrillos = getTotalExact("cigarrillos");
      const debito = getTotalContains("debito");

      await axios.post(`${URL}plataCaja/post`, {
        Id_sucursal: id_sucursal,
        Id_usuario: id_usuario,
        cantidadPlata: plataIF,
        faltante: calcularFaltante(),
        IdCaja: IdCaja,
        TotalEnCaja: total_cierre
      });

      await axios.put(`${URL}plataCaja/cerrarCaja`, {
        Id_usuario: id_usuario,
        Id_caja: IdCaja
      });

      await axios.put(`${URL}turno/finalizarTurno`, {
        IdTurno: IdTurno,
        Ingreso: plataIngreso,
        Egreso: plataEgreso,
        Efectivo: efectivo,
        Transferencia: transferencia,
        Cigarrillos: cigarrillos,
        Debito: debito,
        TotalEnCaja: total_cierre,
        FechaSalida: fechaRegistro
      });

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Caja cerrada correctamente!",
        timer: 1500,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(() => {
        sessionStorage.removeItem("idCaja");
        navigate("/");
      });
    } catch (error) {
      console.log("Error al cerrar la caja:", error);
    }
  };

  useEffect(() => {
    obtenerDatosCaja();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const intervalID = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(intervalID);
  }, []);

  // Iconos para la tabla (ahora por Id_item)
  const iconMap = {
    1: faMoneyBillWave,
    4: faMobileAlt,
    5: faUser,
    6: faWallet,
    7: faCreditCard,
    8: faCreditCard,
    999999: faSmoking // ✅ Cigarrillos
  };

  return (
    <>
      <Navbar bg="dark" expand="lg" sticky="top" className="app-navbar shadow-sm">
        <Container fluid>
          <Navbar.Brand href="#" className="brand-link">
            <a href="/testVenta" className="brand-link">
              <span className="brand-badge">A&L</span>
              <span className="brand-text">SOFTWARE</span>
            </a>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" className="toggler-clean" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto flex-wrap gap-2 nav-actions">
              {rolUsuario?.toLowerCase() === "empleado" && (
                <Dropdown className="nav-dd">
                  <Dropdown.Toggle className="nav-dd-toggle">VENTAS</Dropdown.Toggle>
                  <Dropdown.Menu className="nav-dd-menu">
                    <Button onClick={() => navegar("/testVenta")} className="nav-dd-item">
                      VENTA
                    </Button>
                    <Button onClick={() => navegar("/corte")} className="nav-btn">
                      DETALLE VENTA
                    </Button>
                  </Dropdown.Menu>
                </Dropdown>
              )}

              {rolUsuario?.toLowerCase() === "admin" && (
                <>
                  <Dropdown className="nav-dd">
                    <Dropdown.Toggle className="nav-dd-toggle">VENTAS</Dropdown.Toggle>
                    <Dropdown.Menu className="nav-dd-menu">
                      <Button onClick={() => navegar("/testVenta")} className="nav-dd-item">
                        VENTA
                      </Button>
                      <Button onClick={() => navegar("/corte")} className="nav-btn">
                        DETALLE VENTA
                      </Button>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Button onClick={() => navegar("/usuarios")} className="nav-btn">
                    USUARIOS
                  </Button>
                  <Button onClick={() => navegar("/reportes")} className="nav-btn">
                    REPORTES
                  </Button>
                  <Button onClick={() => navegar("/stock")} className="nav-btn">
                    STOCK
                  </Button>
                  <Button onClick={() => navegar("/productos")} className="nav-btn">
                    PRODUCTOS
                  </Button>
                  <Button onClick={() => navegar("/configuracion")} className="nav-btn">
                    PROVEEDORES
                  </Button>
                  <Button onClick={() => navegar("/metodoPago")} className="nav-btn">
                    MÉTODO PAGO
                  </Button>

                  <Dropdown className="nav-dd">
                    <Dropdown.Toggle className="nav-dd-toggle">COMPRAS</Dropdown.Toggle>
                    <Dropdown.Menu className="nav-dd-menu">
                      <Button onClick={() => navegar("/compra")} className="nav-dd-item">
                        COMPRA
                      </Button>
                      <Button onClick={() => navegar("/auditoriaC")} className="nav-dd-item">
                        AUDITORIA
                      </Button>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Button onClick={() => navegar("/corte2")} className="nav-btn">
                    CORTE
                  </Button>
                  <Button onClick={() => navegar("/clientes")} className="nav-btn">
                    CLIENTES
                  </Button>
                  <Button onClick={() => navegar("/turno")} className="nav-btn">
                    TURNO
                  </Button>
                </>
              )}

              {rolUsuario?.toLowerCase() === "encargado" && (
                <>
                  <Button onClick={() => navegar("/productos")} className="nav-btn">
                    PRODUCTOS
                  </Button>
                  <Button onClick={() => navegar("/stock")} className="nav-btn">
                    STOCK
                  </Button>
                  <Button onClick={() => navegar("/configuracion")} className="nav-btn">
                    PROVEEDORES
                  </Button>
                  <Button onClick={() => navegar("/metodoPago")} className="nav-btn">
                    MÉTODO PAGO
                  </Button>
                </>
              )}
            </Nav>

            <Nav className="ms-auto">
              <Button onClick={handleShowModal} className="btn-cerrarT nav-btn-accent">
                <FontAwesomeIcon icon={faDoorOpen} className="me-2" /> CERRAR TURNO
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="top-info">
        <div className="info-chip">
          USUARIO: <strong>{nombreUsuario}</strong>
        </div>
        <div className="info-chip">
          SUCURSAL: <strong>{nombreSucursal}</strong>
        </div>
        <div className="info-chip">
          CAJA: <strong>{IdCaja}</strong>
        </div>
        <div className="info-chip">{time.toLocaleString()}</div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold" style={{ letterSpacing: "1px" }}>
            CONTROL DE CAJA
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ paddingTop: "0px" }}>
          <h5 className="mb-3 text-secondary" style={{ fontWeight: 500 }}>
            PLATA EN CAJA:
            <strong className="ms-2 text-success">{formatCurrency(total_cierre)}</strong>
          </h5>

          <MDBInputGroup className="mb-2 shadow-sm" style={{ borderRadius: "10px" }}>
            <span className="input-group-text bg-white border-end-0">
              <FontAwesomeIcon icon={faDollar} size="lg" style={{ color: "#012541" }} />
            </span>

            <input
              className="form-control border-start-0"
              type="text"
              placeholder="Ingrese la cantidad de plata en caja"
              value={cantidadPlataCaja}
              onChange={(e) => setCantidadPlataCaja(e.target.value)}
              style={{ background: "#f8fafc" }}
            />
          </MDBInputGroup>

          {cantidadPlataCaja && parseFloat(cantidadPlataCaja) < total_cierre && (
            <p className="text-danger small mt-1">¡Está faltando plata y se verá en tu corte!</p>
          )}

          {calcularFaltante() === 0 && (
            <p className="text-success small mt-1">¡Gracias, todo en orden!</p>
          )}

          <h6 className="fw-bold mt-4 mb-2">Resumen de Caja</h6>
          <table className="table table-sm table-striped table-light shadow-sm">
            <tbody>
              <tr>
                <td className="fw-semibold">Apertura de caja</td>
                <td className="text-end fw-bold text-success">
                  + {formatCurrency(plataApertura)}
                </td>
              </tr>
              <tr>
                <td className="fw-semibold">Egreso de caja</td>
                <td className="text-end fw-bold text-danger">
                  - {formatCurrency(plataEgreso)}
                </td>
              </tr>
              <tr>
                <td className="fw-semibold">Ingreso de caja</td>
                <td className="text-end fw-bold text-success">
                  + {formatCurrency(plataIngreso)}
                </td>
              </tr>
            </tbody>
          </table>

          <hr />

          <h6 className="fw-bold mt-4 mb-2">Métodos de Pago</h6>
          <table className="table table-sm table-striped shadow-sm">
            <tbody>
              {metoPago.map((tipo) => {
                const isCigarrillos = Number(tipo.Id_item) === 999999;

                return (
                  <tr key={tipo.Id_item}>
                    <td className="fw-semibold d-flex align-items-center gap-2">
                      <FontAwesomeIcon
                        icon={iconMap[tipo.Id_item] || faWallet}
                      />
                      {tipo.tipo_item}
                     
                    </td>

                    <td className={`text-end fw-bold `}>
                      {formatCurrency(tipo.total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h5 className="mt-3">
            FALTANTE:{" "}
            <strong className={calcularFaltante() === 0 ? "text-success" : "text-danger"}>
              {formatCurrency(calcularFaltante())}
            </strong>
          </h5>

          <div className="mt-3 text-center">
            <Button
              onClick={cerrarCaja}
              variant="outline-danger"
              className="px-4 py-2 fw-bold"
              style={{
                borderRadius: "12px",
                letterSpacing: "1px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                margin: "0 auto"
              }}
            >
              <FontAwesomeIcon icon={faDoorOpen} size="lg" />
              CERRAR TURNO
            </Button>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0">
          <Button variant="danger" onClick={handleCloseModal} className="px-3">
            CERRAR
          </Button>
        </Modal.Footer>

        {cantidadPlataCaja && parseFloat(cantidadPlataCaja) === parseFloat(total_cierre) && (
          <p className="text-success text-center small mb-3">¡Bien hecho!</p>
        )}
      </Modal>
    </>
  );
}

export default App;
