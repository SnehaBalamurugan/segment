import React, { useState } from 'react';
import { Button, Drawer, Input, Space, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import SelectField from './SelectField';
import axios from 'axios';

const DrawerComponent = ({ open, setOpen }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [options, setOptions] = useState([
        { value: 'first_name', label: 'First Name' },
        { value: 'last_name', label: 'Last Name' },
        { value: 'gender', label: 'Gender' },
        { value: 'age', label: 'Age' },
        { value: 'account_name', label: 'Account Name' },
        { value: 'city', label: 'City' },
        { value: 'state', label: 'State' },
    ]);
    const [segmentName, setSegmentName] = useState()
    const [selectedDatas, setSelectedDatas] = useState([]);
    const [addSegment, setAddSegment] = useState([]);
    const [selectedBlueBoxValues, setSelectedBlueBoxValues] = useState([]);
    const [allSchemaData, setAllSchemaData] = useState([]);

    const onClose = () => {
        setOpen(false);
    };

    // onChange event of 'Add schema to segement dropdown'
    const handleChange = (selectedValues) => {
        setSelectedDatas(selectedValues);
    };

    // onClick event of '+Add new schema'
    const addNewSchema = () => {

        // To update all schemaDatas together
        const newSchemaData = selectedDatas.map(selectedValue => {
            return options.find(option => option.value === selectedValue);
        });

        const updatedAllSchemaData = [...allSchemaData, ...newSchemaData];
        const uniqueSchemaData = Array.from(new Set(updatedAllSchemaData.map(schema => schema.value)))
            .map(value => updatedAllSchemaData.find(schema => schema.value === value));
        setAllSchemaData(uniqueSchemaData);

        // Filter out the selected values from the options
        const updatedOptions = options.filter(option => !selectedDatas.includes(option.value));

        // Update the "Add schema to segment" dropdown with the filtered options
        setOptions(updatedOptions);

        // Add the selected values to the addSegment state
        setAddSegment(prevAddSegment => [...prevAddSegment, ...selectedDatas]);

        // Add the selected values to the selectedBlueBoxValues state
        setSelectedBlueBoxValues(prevSelectedValues => [...prevSelectedValues, ...selectedDatas]);

        // Clear the selected values for the "Add schema to segment" dropdown
        setSelectedDatas([]);
    };

    // onClick event of 'dropdowns which are inside b;ue box'
    const blueBoxChange = (value, index) => {
        // Remove the selected value from options
        const updatedOptions = options.filter(option => option.value !== value);

        // Add back the previously selected value to options
        if (selectedBlueBoxValues[index]) {
            updatedOptions.push({ value: selectedBlueBoxValues[index], label: selectedBlueBoxValues[index] });
        }

        setOptions(updatedOptions);

        // Update the selectedBlueBoxValues state
        setSelectedBlueBoxValues(prevValues => [...prevValues.slice(0, index), value, ...prevValues.slice(index + 1)]);
    };

    //Success and Error messagesw
    const success = () => {
        message.success('Schema Added Successfully !');
    };

    const error = () => {
        message.error('Please Add Schema To Segment !');
    };

    // onClick event of 'Save the segment' button
    const onSaveSchemaData = async () => {
        if (allSchemaData?.length > 0) {
            const webhookUrl = 'https://webhook.site/195837c1-cdda-4f51-b6d8-650a1d7af945'; // Replace with your webhook URL

            const data = {
                segment_name: segmentName,
                schema: allSchemaData
            };

            try {
                const response = await axios.post(webhookUrl, JSON.stringify(data));
                console.log('Response from webhook:', response.data);
            } catch (error) {
                console.error('Error sending data to webhook:', error);
            }

            success()
            onClose()
            setSegmentName()
            setSelectedBlueBoxValues([])
            setAllSchemaData([])
        }
        else {
            error()
        }
    };

    return (
        <Drawer title="Saving Segment..." onClose={onClose} open={open} footer={
            <Space>
                <Button style={{ backgroundColor: 'green', color: 'white' }} onClick={onSaveSchemaData}>Save the Segment</Button>
                <Button style={{ backgroundColor: 'white', color: 'red' }} onClick={onClose}>
                    Cancel
                </Button>
            </Space>
        }>
            Enter the Name of the Segment
            <Input className='mt-2' placeholder="Name of the segment" value={segmentName} onChange={(e) => { setSegmentName(e.target.value) }} />
            <div className="alert alert-primary mt-2" role="alert">
                <InfoCircleOutlined /> To save your segment, you need to add the schemas to build the query
            </div>
            {selectedBlueBoxValues?.length > 0 ?
                <div className="blue-border">
                    {selectedBlueBoxValues.map((selectedValue, index) => (
                        <div key={index} className="col-md-12">
                            <div className="row">
                                <div className="col-md-8">
                                    <SelectField
                                        label="Add schema to segment"
                                        data={options}
                                        value={`${selectedValue}`}
                                        name={`add_segment_${index}`}
                                        defaultValue=""
                                        width="100%"
                                        mode={false}
                                        onChange={(value) => blueBoxChange(value, index)}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Button>-</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> : null}
            <SelectField
                label="Add schema to segment"
                data={options}
                value={selectedDatas}
                onChange={handleChange}
                name="add_segment"
                defaultValue={[]}
                mode={true}
                width="100%"
            />
            <div className='mt-2'>
                <a href="javascript:;" onClick={addNewSchema}>+Add new schema</a>
            </div>
        </Drawer>
    );
};

export default DrawerComponent;