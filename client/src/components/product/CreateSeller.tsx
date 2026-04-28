import { Button, Flex } from 'antd';
import CreateSellerModal from '../modal/CreateSellerModal';
import { useState } from 'react';

const CreateSeller = () => {
  const [createSellerModalOpen, setCreateSellerModalOpen] = useState(false);

  return (
    <>
      <div className="action-card">
        <Flex vertical align="center" justify="center" gap={10}>
          <h3 className="action-title">Create New Seller</h3>

          <p className="action-subtitle">
            Add a new seller to manage product sources
          </p>

          <Button
            type="primary"
            className="action-btn"
            onClick={() => setCreateSellerModalOpen(true)}
          >
            Create Seller
          </Button>
        </Flex>
      </div>

      <CreateSellerModal
        openModal={createSellerModalOpen}
        setOpenModal={setCreateSellerModalOpen}
      />
    </>
  );
};

export default CreateSeller;