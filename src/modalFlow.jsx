import React, { useEffect, useRef, useState } from 'react';
import './style.css';

const ModalFlow = ({
  closeOnOutsideClick = false,
  components = {},
  onClose,
  activeKey
}) => {
  const [activeKeyLocal, setActiveKeyLocal] = useState(activeKey);
  const [values, setValues] = useState({});
  const [childrens, setChildrens] = useState(null);
  const componentRef = useRef();

  function handleClickOutside(event) {
    if (
      event &&
      event.target &&
      componentRef &&
      componentRef.current &&
      !componentRef.current.contains(event.target)
    ) {
      close();
    }
  }

  useEffect(() => {
    if (closeOnOutsideClick) {
      document.addEventListener('mousedown', function (e) {
        handleClickOutside(e);
      });
      return document.removeEventListener('mousedown', function (e) {
        handleClickOutside(e);
      });
    }
  }, [closeOnOutsideClick]);

  useEffect(() => {
    setActiveKeyLocal(activeKey);
  }, [activeKey]);

  const handleNext = (index) => {
    setActiveKeyLocal(index);
  };

  const handlePrev = (index) => {
    setActiveKeyLocal(index);
  };

  function close() {
    setActiveKeyLocal(false);
    if (onClose) onClose();
  }

  const onChange = (newValues) => {
    setValues({ ...values, ...newValues });
  };

  useEffect(() => {
    const onlyComponents = [];
    const componentKeys = [];

    for (const i in components) {
      onlyComponents.push(components[i]);
      componentKeys.push(i);
    }

    const childrenWithProps = React.Children.map(onlyComponents, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          values,
          handlePrev,
          handleNext,
          onChange,
          closeModal: close
        });
      }
      return child;
    });

    const childrensWithKey = childrenWithProps.map((e, index) => ({
      component: e,
      key: componentKeys[index]
    }));

    setChildrens(childrensWithKey);
  }, [childrens]);

  let activeIndex = null;

  if (childrens && activeKey) {
    activeIndex = childrens.findIndex((e) => e.key === activeKeyLocal);
    var activeComponent =
      childrens && childrens[activeIndex] && childrens[activeIndex].component
        ? childrens[activeIndex].component
        : null;
  }

  return (
    <div className={`modal ${activeComponent && 'modal--visible'}`}>
      <div ref={componentRef} className={`modal-body`}>
        <div>{activeComponent && activeComponent}</div>
      </div>
    </div>
  );
};

export default ModalFlow;
