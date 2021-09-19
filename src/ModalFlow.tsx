/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import * as React from 'react';
import './ModalFlow.css';

export const ModalFlow = ({
  closeOnOutsideClick = false,
  components = {},
  onClose,
  activeKey,
  onActiveKeyChange,
  initialValues,
  bodyStyles,
  modalStyles
}: { [key: string]: any; }) => {

  const [prevKey , setPrevKey] = React.useState('');
  const [activeKeyLocal, setActiveKeyLocal] = React.useState('');
  const [values, setValues] = React.useState(initialValues ? {...initialValues} : {});
  const [childrens, setChildrens] = React.useState(null);
  const componentRef = React.useRef();

  console.log({activeKeyLocal,activeKey})

  const handleActiveKeyChange = (value) => {
    setPrevKey(activeKeyLocal);
    if(!onActiveKeyChange){
      setActiveKeyLocal(value);
    }else{
      onActiveKeyChange(value);
    }
  }

  const close = () => {
    if(onClose){
      onClose();
    }else{
      setActiveKeyLocal('');
    }
  };

  React.useEffect(() => {
    setActiveKeyLocal(activeKey);
  },[activeKey])

  const handleClickOutside = React.useCallback((event: any) => {
    if (
      event &&
      event.target &&
      componentRef &&
      componentRef.current &&
      !componentRef.current.contains(event.target)
    ) {close();}
  },[close]);

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
  }, [closeOnOutsideClick,handleClickOutside]);

  const handleNext = (index: unknown) => {
    if(index){
      handleActiveKeyChange(index);
    }else{
      let keys = Object.keys(components);
      let activeIndex = keys.findIndex(e => e === activeKeyLocal);
      if(activeIndex >= 0 && activeIndex !== keys.length - 1){
        handleActiveKeyChange(keys[activeIndex + 1 ])
      }
    };
  };

  const handlePrev = (index: unknown) => {
    if(index){
      handleActiveKeyChange(index);
    }else{
      let keys = Object.keys(components);
      let activeIndex = keys.findIndex(e => e === activeKeyLocal);
      if(activeIndex > 0){
        handleActiveKeyChange((keys[activeIndex - 1 ]));
      }
    };
  };

  const getBack = () => {
    if(prevKey){
      handleActiveKeyChange(prevKey);
    }
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
    };

    const childrenWithProps = React.Children.map(
      onlyComponents,
      (child: any) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            values,
            onChange,
            handlePrev,
            handleNext,
            close,
            getBack,
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
  
  }, [components,activeKeyLocal,values]);

  let activeComponent = null;

  if (childrens && activeKeyLocal) {
    activeComponent = childrens.find(e => e.key === activeKeyLocal).component;
  };

  return (
    <div style={{...modalStyles}} className={`modal-flow ${activeComponent && 'modal-flow--visible'}`}>
      <div style={{...bodyStyles}} ref={componentRef} className={`modal-flow-body`}>
        <div>{activeComponent && activeComponent}</div>
      </div>
    </div>
  );
};
