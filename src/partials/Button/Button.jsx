import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./Button.scss";

const Button = React.forwardRef(
  (
    {
      icon,
      text,
      onClick,
      to,
      href,
      type = "button",
      className = "",
      ...props
    },
    ref
  ) => {
    if (to) {
      return (
        <Link to={to} className={`button ${className}`} {...props} ref={ref}>
          {icon && <span className="button-icon">{icon}</span>}
          {text && <span className="button-text">{text}</span>}
        </Link>
      );
    }

    if (href) {
      return (
        <a href={href} className={`button ${className}`} {...props} ref={ref}>
          {icon && <span className="button-icon">{icon}</span>}
          {text && <span className="button-text">{text}</span>}
        </a>
      );
    }

    return (
      <button
        type={type}
        onClick={onClick}
        className={`button ${className}`}
        {...props}
        ref={ref}
      >
        {icon && <span className="button-icon">{icon}</span>}
        {text && <span className="button-text">{text}</span>}
      </button>
    );
  }
);

Button.propTypes = {
  icon: PropTypes.node,
  text: PropTypes.string,
  onClick: PropTypes.func,
  to: PropTypes.string,
  href: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
};

export default Button;
