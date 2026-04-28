import { DeleteFilled, EditFilled } from '@ant-design/icons';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Flex, Modal, Pagination, Table, Tag } from 'antd';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import {
  useDeleteSellerMutation,
  useGetAllSellerQuery,
} from '../../redux/features/management/sellerApi';
import { IProduct, ISeller } from '../../types/product.types';
import toastMessage from '../../lib/toastMessage';
import SearchInput from '../../components/SearchInput';

const SellerManagementPage = () => {
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: '',
  });

  const { data, isFetching } = useGetAllSellerQuery(query);

  const onChange: PaginationProps['onChange'] = (page) => {
    setQuery((prev) => ({ ...prev, page: page }));
  };

  const tableData = data?.data?.map((seller: ISeller) => ({
    key: seller._id,
    name: seller.name,
    email: seller.email,
    contactNo: seller.contactNo,
  }));

  const columns: TableColumnsType<any> = [
    {
      title: 'Seller Name',
      key: 'name',
      dataIndex: 'name',
      render: (name: string) => <span className="product-name-cell">{name}</span>,
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
      align: 'center',
      render: (email: string) => <span className="date-cell">{email}</span>,
    },
    {
      title: 'Contact Number',
      key: 'contactNo',
      dataIndex: 'contactNo',
      align: 'center',
      render: (contactNo: string) => <Tag color="blue">{contactNo}</Tag>,
    },
    {
      title: 'Action',
      key: 'x',
      align: 'center',
      render: (item) => {
        return (
          <div className="table-actions">
            <UpdateModal product={item} />
            <DeleteModal id={item.key} />
          </div>
        );
      },
      width: '1%',
    },
  ];

  return (
    <div className="manage-page">
      <div className="page-header">
        <h1>Seller Management</h1>
        <p>View, search and manage all product sellers</p>
      </div>

      <div className="filter-card">
        <Flex justify="end" style={{ gap: 8 }}>
          <SearchInput setQuery={setQuery} placeholder="Search Seller..." />
        </Flex>
      </div>

      <div className="table-card">
        <Table
          size="middle"
          loading={isFetching}
          columns={columns}
          dataSource={tableData}
          pagination={false}
          scroll={{ x: true }}
        />
      </div>

      <Flex justify="center" style={{ marginTop: '1rem' }}>
        <Pagination
          current={query.page}
          onChange={onChange}
          defaultPageSize={query.limit}
          total={data?.meta?.total}
        />
      </Flex>
    </div>
  );
};

/**
 * Update Modal
 */
const UpdateModal = ({ product }: { product: IProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleSubmit } = useForm();

  const onSubmit = (data: FieldValues) => {
    console.log({ data, product });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // ! Remove this early return to work with this component
  return;

  return (
    <>
      <Button onClick={showModal} type="primary" className="table-btn-small edit-btn">
        <EditFilled />
      </Button>

      <Modal
        title="Update Seller Info"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        className="custom-modal"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <h1>Working on it...!!!</h1>
          <Button htmlType="submit" type="primary" className="modal-submit-btn">
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
};

/**
 * Delete Modal
 */
const DeleteModal = ({ id }: { id: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteSeller] = useDeleteSellerMutation();

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteSeller(id).unwrap();
      if (res.statusCode === 200) {
        toastMessage({ icon: 'success', text: res.message });
        handleCancel();
      }
    } catch (error: any) {
      handleCancel();
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal} type="primary" className="table-btn-small delete-btn">
        <DeleteFilled />
      </Button>

      <Modal
        title="Delete Seller"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        className="custom-modal"
      >
        <div className="delete-modal-content">
          <h2>Are you sure you want to delete this seller?</h2>
          <h4>You won&apos;t be able to revert it.</h4>

          <div className="delete-modal-actions">
            <Button onClick={handleCancel} type="primary" className="cancel-btn">
              Cancel
            </Button>

            <Button onClick={() => handleDelete(id)} type="primary" className="confirm-delete-btn">
              Yes! Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SellerManagementPage;