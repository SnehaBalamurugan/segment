import React, { useState } from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import DrawerComponent from './DrawerComponent';

const MainComponent = () => {
    const [open, setOpen] = useState(false);

    const onButtonClick = () => {
        setOpen(true)
    }

    return (
        <div className='button-container'>
            <Button className='button' icon={<ArrowRightOutlined />} type='primary' onClick={() => { onButtonClick() }}>Save Segment</Button>
            <DrawerComponent open={open} setOpen={setOpen}/>
        </div>
    )
}

export default MainComponent