import type { ReactNode } from "react";
import "./index.scss";

type Props = {
  visible: boolean;
  children?: ReactNode;
};

export default function SplashScreen({ visible, children }: Props) {
  return (
    <div
      className={`splash-screen ${visible ? "splash-screen--visible" : "splash-screen--hidden"}`}
      aria-hidden={!visible}
    >
      {/* Elementos de fondo decorativos */}
      <div className="splash-screen__background">
        <div className="splash-screen__background-circle splash-screen__background-circle--top"></div>
        <div className="splash-screen__background-circle splash-screen__background-circle--bottom"></div>
      </div>

      {/* Contenedor principal */}
      <div className="splash-screen__container">
        {/* Logo con efectos mejorados */}
        <div className="splash-screen__logo-wrapper">
          {/* Anillo exterior animado */}
          <div className="splash-screen__ring splash-screen__ring--outer"></div>
          <div className="splash-screen__ring splash-screen__ring--inner"></div>
          
          {/* Logo */}
          <div className="splash-screen__logo">
            <img
              src="/icons/SplashMobil.png"
              alt="Logo"
              className="splash-screen__logo-image"
            />
            {/* Brillo sutil */}
            <div className="splash-screen__logo-shine"></div>
          </div>
        </div>

        {/* Texto de carga mejorado */}
        <div className="splash-screen__text">
          <h2 className="splash-screen__title">
            Cargando
          </h2>
          <p className="splash-screen__subtitle">
            Preparando tu experiencia...
          </p>
        </div>

        {/* Indicador de progreso moderno */}
        <div className="splash-screen__progress">
          <div className="splash-screen__progress-bar">
            <div className="splash-screen__progress-fill"></div>
          </div>
        </div>

        {/* Puntos de carga animados */}
        <div className="splash-screen__dots">
          <div className="splash-screen__dot splash-screen__dot--1"></div>
          <div className="splash-screen__dot splash-screen__dot--2"></div>
          <div className="splash-screen__dot splash-screen__dot--3"></div>
        </div>

        {/* Contenido adicional */}
        {children && (
          <div className="splash-screen__children">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}