import { Button, Flex } from "antd";
import { useState } from "react";
import { useCreateBrandMutation } from "../../redux/features/management/brandApi";
import toastMessage from "../../lib/toastMessage";
import { SpinnerIcon } from "@phosphor-icons/react";

const CreateBrand = () => {
  const [createCategory, { isLoading }] = useCreateBrandMutation();
  const [brand, setBrand] = useState("");

  const handleClick = async () => {
    try {
      const res = await createCategory({ name: brand }).unwrap();
      if (res.statusCode === 201) {
        toastMessage({ icon: "success", text: res.message });
        setBrand("");
      }
    } catch (error: any) {
      toastMessage({ icon: "error", text: error.data.message });
    }
  };

  return (
    <div className="action-card">
      <Flex vertical align="center" gap={10}>
        <h3 className="action-title">Create New Brand</h3>

        <p className="action-subtitle">
          Add product brand for better classification
        </p>

        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="input-field modern-input"
          placeholder="Enter brand name"
        />

        <Button
          htmlType="button"
          onClick={handleClick}
          type="primary"
          disabled={isLoading}
          className="action-btn"
        >
          {isLoading && <SpinnerIcon className="spin" weight="bold" />}
          Create Brand
        </Button>
      </Flex>
    </div>
  );
};

export default CreateBrand;
