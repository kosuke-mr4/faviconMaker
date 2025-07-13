import React from 'react'

interface NavbarProps {
  onThemeToggle: () => void
  isDarkMode: boolean
}

const Navbar: React.FC<NavbarProps> = ({ onThemeToggle, isDarkMode }) => {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <div className="navbar-item">
            <span className="icon-text">
              <span className="icon">
                <i className="fas fa-image"></i>
              </span>
              <span className="navbar-title">Favicon Maker</span>
            </span>
          </div>
        </div>
        
        <div className="navbar-menu">
          <div className="navbar-end">
            <div className="navbar-item">
              <button 
                className="button theme-toggle-button"
                onClick={onThemeToggle}
                title={isDarkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
              >
                <span className="icon">
                  <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar