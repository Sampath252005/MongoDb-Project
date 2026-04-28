import { Button, Flex } from 'antd';
import { useState } from 'react';
import { useCreateCategoryMutation } from '../../redux/features/management/categoryApi';
import toastMessage from '../../lib/toastMessage';
import { SpinnerIcon } from '@phosphor-icons/react';

const CreateCategory = () => {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const [category, setCategory] = useState('');

  const handleClick = async () => {
    try {
      const res = await createCategory({ name: category }).unwrap();
      if (res.statusCode === 201) {
        toastMessage({ icon: 'success', text: res.message });
        setCategory('');
      }
    } catch (error: any) {
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  return (
    <div className="action-card">
      <Flex vertical align="center" gap={10}>
        <h3 className="action-title">Create New Category</h3>

        <p className="action-subtitle">
          Organize products by category
        </p>

        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field modern-input"
          placeholder="Enter category name"
        />

        <Button
          htmlType="button"
          onClick={handleClick}
          type="primary"
          disabled={isLoading}
          className="action-btn"
        >
          {isLoading && <SpinnerIcon className="spin" weight="bold" />}
          Create Category
        </Button>
      </Flex>
    </div>
  );
};

export default CreateCategory;