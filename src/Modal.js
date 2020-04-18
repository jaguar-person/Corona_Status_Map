import React from "react";
class Modal extends React.Component {
  constructor(props) {
    super();

    this.state = {};
  }

  render() {
    const closeModal = this.props.closeModal;

    return (
      <div className={`modal is-active is-clipped ModalShowing-${this.props.modelState}`}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <button className="modal-close is-large" aria-label="close" onClick={event => closeModal(event)} />
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Modal;
