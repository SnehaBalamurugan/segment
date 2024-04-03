import React from 'react';
import { Select } from 'antd';

const SelectField = ({ label, data, value, onChange, name,defaultValue,width,mode }) => {

    return (
        <div className='mt-2'>
        <Select mode={mode === true ? "multiple" : ''} style={{width:width}} placeholder={label} name={name} value={value} onChange={onChange} options={data} />
        </div>
    )
}

export default SelectField;