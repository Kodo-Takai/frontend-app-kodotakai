import type { ReactNode } from "react";
import "./index.scss";

type Props = {
  visible: boolean;
  children?: ReactNode;
};

export default function SplashScreen({
  visible,
  children,
}: Props) {
  return (
    <div
      className={`splash-screen ${visible ? "splash-screen--visible" : "splash-screen--hidden"}`}
      aria-hidden={!visible}
    >
      {/* Elementos de fondo decorativos */}
      <div className="splash-screen__background">
        <div className="splash-screen__background-circle splash-screen__background-circle--top"></div>
        <div className="splash-screen__background-circle splash-screen__background-circle--bottom"></div>
        <div className="splash-screen__background-circle splash-screen__background-circle--accent"></div>
        
        {/* Líneas decorativas */}
        <div className="splash-screen__accent-line splash-screen__accent-line--horizontal"></div>
        <div className="splash-screen__accent-line splash-screen__accent-line--vertical"></div>
      </div>

      {/* Decoradores de esquina */}
      <div className="splash-screen__corner-accent splash-screen__corner-accent--top-left"></div>
      <div className="splash-screen__corner-accent splash-screen__corner-accent--top-right"></div>
      <div className="splash-screen__corner-accent splash-screen__corner-accent--bottom-left"></div>
      <div className="splash-screen__corner-accent splash-screen__corner-accent--bottom-right"></div>

      {/* Contenedor principal */}
      <div className="splash-screen__container">
        {/* Logo con efectos mejorados */}
        <div className="splash-screen__logo-wrapper">
          {/* Anillos animados */}
          <div className="splash-screen__ring splash-screen__ring--outer"></div>
          <div className="splash-screen__ring splash-screen__ring--inner"></div>

          {/* Logo */}
          <div className="splash-screen__logo">
            {/* Auras expansivas */}
            <div className="splash-screen__logo-aura"></div>
            <div className="splash-screen__logo-aura splash-screen__logo-aura--secondary"></div>

            {/* Imagen del logo */}
            <img
              src="/avatar_animated.svg"
              alt="Kodotakai Tourism"
              className="splash-screen__logo-image"
            />

            {/* Brillo animado */}
            <div className="splash-screen__logo-shine"></div>

            {/* Anillo de pulso */}
            <div className="splash-screen__logo-pulse-ring"></div>
          </div>
        </div>

        {/* Texto de carga mejorado */}
        <div className="splash-screen__text">
          <h2 className="splash-screen__title">ViajaYa</h2>
          <p className="splash-screen__subtitle">Descubre experiencias únicas</p>
          <p className="splash-screen__tagline">Viajes que inspiran</p>
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
          <div className="splash-screen__children">{children}</div>
        )}
      </div>
    </div>
  );
}