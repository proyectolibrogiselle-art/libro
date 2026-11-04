'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, InstagramIcon, LinkedInIcon } from '@/components/Icons';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'La Autora', href: '#la-autora' },
  { label: 'Manifiesto', href: '#manifiesto' },
  { label: 'Publicaciones', href: '#publicaciones' },
  { label: 'Noticias', href: '#noticias' },
  { label: 'Eventos', href: '#eventos' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Contacto', href: '#contacto' },
];

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/carmenibaez22',
    ariaLabel: 'Perfil oficial de Instagram de Carmen Ibáñez',
    title: 'Instagram oficial de Carmen Ibáñez (abre en pestaña nueva)',
    icon: InstagramIcon,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/angela-soto-ib%C3%B1aez-27a86698',
    ariaLabel: 'Perfil profesional de LinkedIn de Carmen Ibáñez',
    title: 'LinkedIn oficial de Carmen Ibáñez (abre en pestaña nueva)',
    icon: LinkedInIcon,
  },
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
        {/* Monograma oficial de Carmen Ibáñez */}
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

        {/* Menú de Escritorio: Arquitectónico, limpio y ligero */}
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

          {/* Redes Sociales en Escritorio: Inmediatamente después de Contacto */}
          <div className="nav-desktop-socials" aria-label="Redes sociales oficiales">
            <span className="nav-desktop-socials-divider" aria-hidden="true" />
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-desktop-social-link"
                  aria-label={social.ariaLabel}
                  title={social.title}
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
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

        {/* Menú Desplegable Móvil */}
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
              <ArrowRightIcon size={15} style={{ color: 'var(--accent-copper)', opacity: 0.9 }} />
            </a>
          ))}

          {/* Redes Sociales en Menú Móvil */}
          <div className="nav-mobile-socials-block">
            <span className="nav-mobile-socials-heading">Redes oficiales</span>
            <div className="nav-mobile-socials-grid">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-mobile-social-btn"
                    onClick={handleLinkClick}
                    aria-label={social.ariaLabel}
                    title={social.title}
                    tabIndex={isOpen ? 0 : -1}
                  >
                    <Icon size={18} />
                    <span>{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
