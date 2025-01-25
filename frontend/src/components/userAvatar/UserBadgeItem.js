import { IoClose } from "react-icons/io5"; // Import a close icon from react-icons

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <div
      className="flex items-center px-2 py-1 m-1 mb-2 bg-purple-500 text-white rounded-lg text-xs cursor-pointer"
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span className="ml-1">(Admin)</span>}
      <IoClose className="pl-1 cursor-pointer" />
    </div>
  );
};

export default UserBadgeItem;
