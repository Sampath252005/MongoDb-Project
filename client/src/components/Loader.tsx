import { Flex } from 'antd';
import loader from '../assets/loading.gif';

const Loader = () => (
  <div className="loader-container">
    <Flex justify="center" align="center" className="loader-wrapper">
      <img src={loader} alt="loader" className="loader-img" />
    </Flex>
  </div>
);

export default Loader;