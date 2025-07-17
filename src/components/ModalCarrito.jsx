/* eslint-disable react/prop-types */
import styled from "styled-components";



const ModalCarrito = ({children, estado, cambiarEstado})  => {




  return (
    <>
        {estado && 

        <Overlay>
            <ContenedorModal>
            <EncabesadoModal>
                <h3>VENTA</h3> <br /> <br /><br />
              </EncabesadoModal>
                <BotonCerrar onClick={()=>cambiarEstado(false)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-x"
                    viewBox="0 0 16 16"                
                >
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
                </BotonCerrar>

                {children}
            </ContenedorModal>
        </Overlay>
        }
    </>
  )
}

export default ModalCarrito


const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContenedorModal = styled.div`
  width: 900px;
  height: 900px;
  background: #f2f2f2;
  position: relative;
  border-radius: 5px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 20px;
  display: flex;
`;

const EncabesadoModal = styled.div`
  display: flex;
  aling-items: center;
  justify-content: space-beween;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;

  h3 {
    font-weight: 500;
    font-size: 35px;
    color: #308E53
  }

`;

const BotonCerrar = styled.button`
    position: absolute;
    top: 10px;
    right: 25px;
    width: 40px;
    height: 40px;
    border: none;
    background: #f2f2f2;
    cursor: pointer;
    transition: 0.3s ease all;
    border-radius: 10px;
    color: #308E53;

    svg:hover {
    background:  #f2f2f2;

    svg {
      width: 100%;
      height: 100%;
    
  }
`;