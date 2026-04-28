import { Col, Row } from 'antd';

interface Props {
  name: string;
  errors?: any;
  label: string;
  type?: string;
  register: any;
  required?: boolean;
  defaultValue?: any;
}

const CustomInput = ({
  name,
  errors = {},
  required = false,
  label,
  register,
  type = 'text',
}: Props) => {
  return (
    <Row className="form-row" gutter={[8, 8]}>
      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      </Col>

      <Col xs={{ span: 24 }} lg={{ span: 18 }}>
        <div className="input-wrapper">
          <input
            id={name}
            type={type}
            placeholder={`Enter ${label}`}
            {...register(name, { required: required })}
            className={`input-field modern-input ${
              errors[name] ? 'input-field-error' : ''
            }`}
          />

          {errors[name] && (
            <span className="input-error-text">{label} is required</span>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default CustomInput;