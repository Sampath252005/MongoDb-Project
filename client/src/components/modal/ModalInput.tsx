import { Col, Row } from 'antd';

interface Props {
  name: string;
  label: string;
  type?: string;
  handleChange: any;
  defaultValue?: any;
}

const ModalInput = ({
  name,
  label,
  handleChange,
  defaultValue = '',
  type = 'text',
}: Props) => {
  return (
    <Row className="form-row" gutter={[8, 8]}>
      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
        <label htmlFor={name} className="label">
          {label}
        </label>
      </Col>

      <Col xs={{ span: 24 }} lg={{ span: 18 }}>
        <div className="input-wrapper">
          <input
            id={name}
            type={type}
            name={name}
            value={defaultValue}
            placeholder={`Enter ${label}`}
            onChange={handleChange}
            className="input-field modern-input"
          />
        </div>
      </Col>
    </Row>
  );
};

export default ModalInput;