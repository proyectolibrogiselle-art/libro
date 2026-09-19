'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'La Autora', href: '#la-autora' },
  { label: 'Publicaciones', href: '#publicaciones' },
  { label: 'Noticias', href: '#noticias' },
  { label: 'Eventos', href: '#eventos' },
  { label: 'Galería', href: '#galeria' },
];

export default function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);

  // Cerrar menú con tecla Escape para máxima accesibilidad
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Cerrar menú automáticamente si la ventana se expande a escritorio (> 768px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="main-header-nav">
      <div className="main-header-container">
        {/* Logotipo / Monograma oficial de Carmen Ibáñez */}
        <Link href="/" className="nav-brand-link" onClick={handleLinkClick}>
          <img
            src="/images/logo-ci.png"
            alt="Monograma Carmen Ibáñez"
            className="nav-brand-logo"
          />
          <span className="cinzel-heading nav-brand-title">
            Carmen Ibáñez
          </span>
        </Link>

        {/* Menú Oficial Escritorio: Horizontal y sobrio */}
        <nav
          aria-label="Navegación principal de escritorio"
          className="nav-desktop-links"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="montserrat-body nav-desktop-link"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Botón Hamburguesa Minimalista Móvil */}
        <button
          type="button"
          className={`nav-hamburger-btn ${isOpen ? 'is-active' : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          aria-controls="mobile-navigation-drawer"
        >
          <span className="nav-hamburger-line" />
          <span className="nav-hamburger-line" />
          <span className="nav-hamburger-line" />
        </button>

        {/* Menú Desplegable Móvil (Drawer elegante en una sola columna) */}
        <nav
          id="mobile-navigation-drawer"
          aria-label="Navegación móvil"
          aria-hidden={!isOpen}
          className={`nav-mobile-menu ${isOpen ? 'is-open' : ''}`}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="montserrat-body nav-mobile-link"
              onClick={handleLinkClick}
              tabIndex={isOpen ? 0 : -1}
            >
              <span>{item.label}</span>
              <span className="nav-mobile-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
