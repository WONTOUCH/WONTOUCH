import EditProfile from '../components/edit/EditProfile';
import EditCharacter from '../components/edit/EditCharacter';
import { Route, Routes } from 'react-router-dom';
import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';

function Edit() {
  return (
    <>
      <div className="flex justify-between items-center px-6">
        <BackButton />
        <Header />
      </div>
      <Routes>
        <Route path="profile" element={<EditProfile />} />
        <Route path="character" element={<EditCharacter />} />
      </Routes>
    </>
  );
}

export default Edit;
