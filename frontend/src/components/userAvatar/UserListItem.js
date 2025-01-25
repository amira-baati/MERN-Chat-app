const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="cursor-pointer bg-gray-200 hover:bg-teal-500 hover:text-white w-full flex items-center text-black px-3 py-2 mb-2 rounded-lg"
    >
      <img
        className="mr-2 w-8 h-8 rounded-full"
        src={user.pic} // Utilisation correcte de la prop user
        alt={user.name}
      />
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-xs">
          <b>Email: </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
