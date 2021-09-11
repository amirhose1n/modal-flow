/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import * as React from 'react';
import './styles.css';

export const ModalFlow = ({
  closeOnOutsideClick = false,
  components = {},
  onClose,
  activeKey
}: {
  [key: string]: any;
}) => {
  const [activeKeyLocal, setActiveKeyLocal] = React.useState(activeKey);
  const [values, setValues] = React.useState({});
  const [childrens, setChildrens] = React.useState(null);
  const componentRef = React.useRef();

  function handleClickOutside(event: any) {
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

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (closeOnOutsideClick) {
      document.addEventListener('mousedown', (e) => {
        handleClickOutside(e);
      });
      return document.removeEventListener('mousedown', (e) => {
        handleClickOutside(e);
      });
    }
  }, [closeOnOutsideClick]);

  React.useEffect(() => {
    setActiveKeyLocal(activeKey);
  }, [activeKey]);

  const handleNext = (index: unknown) => {
    setActiveKeyLocal(index);
  };

  const handlePrev = (index: unknown) => {
    setActiveKeyLocal(index);
  };

  function close() {
    setActiveKeyLocal(false);
    if (onClose && typeof onClose === 'function') onClose();
  }

  const onChange = (newValues: any) => {
    setValues({ ...values, ...newValues });
  };

  React.useEffect(() => {
    const onlyComponents = [];
    const componentKeys: string[] = [];

    for (const i in components) {
      onlyComponents.push(components[i]);
      componentKeys.push(i);
    }

    const childrenWithProps = React.Children.map(
      onlyComponents,
      (child: any) => {
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
      }
    );

    const childrensWithKey = childrenWithProps.map((e: any, index: any) => ({
      component: e,
      key: componentKeys[index]
    }));

    setChildrens(childrensWithKey);
  }, [components]);

  let activeIndex = null;
  let activeComponent = null;

  if (childrens && activeKey) {
    activeIndex = childrens.findIndex((e) => e.key === activeKeyLocal);
    activeComponent =
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
