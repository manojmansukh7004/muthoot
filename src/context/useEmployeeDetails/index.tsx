import AsyncStorage from '@react-native-async-storage/async-storage';
import {getSecureData, removeSecureData} from 'api/Axios/TwoWheelerBaseurl';
import {
  createContext,
  useState,
  useEffect,
  useContext,
  FC,
  ReactNode,
} from 'react';

interface EmployeeDetailsContextTypes {
  employeeId: string;
  employeeName: string;
  roleDescription: string;
  SaveEmployeeId: (employeeId: string) => void;
  SaveEmployeeName: (employeeName: string) => void;
  SaveRoleDescription: (roleDescription: string) => void;
  ResetEmployeeDetails: () => void;
}

const EmployeeDetailsContext = createContext<EmployeeDetailsContextTypes>({
  employeeId: '',
  employeeName: '',
  roleDescription: '',
  SaveEmployeeId: () => {},
  SaveEmployeeName: () => {},
  SaveRoleDescription: () => {},
  ResetEmployeeDetails: () => {},
});

interface EmployeeDetialsProviderProps {
  children: ReactNode;
}

export const EmployeeDetialsProvider: FC<EmployeeDetialsProviderProps> = ({
  children,
}: EmployeeDetialsProviderProps) => {
  const [employeeId, setEmployeeId] = useState<string>('MV81050001');
  const [employeeName, setEmployeeName] = useState<string>('Manoj');
  const [roleDescription, setRoleDescription] = useState<string>('');

  const SaveEmployeeId = (employeeId: string) => {
    setEmployeeId(employeeId);
  };
  const SaveEmployeeName = (employeeName: string) => {
    setEmployeeName(employeeName);
  };
  const SaveRoleDescription = (roleDescription: string) => {
    setRoleDescription(roleDescription);
  };

  const ResetEmployeeDetails = async () => {
    console.log('ResetEmployeeDetails*************************');
    await removeSecureData();
    // await AsyncStorage.removeItem('employeeId');
    // await AsyncStorage.removeItem('employeeName');
    // await AsyncStorage.removeItem('roleDescription');
    setEmployeeId('');
    setEmployeeName('');
    setRoleDescription('');
  };

  const getEmployeeId = async () => {
    // const employeeId = await AsyncStorage.getItem('employeeId');
    const secureData = await getSecureData();
    const employeeId = secureData?.employeeId;
    return employeeId;
  };

  const getEmployeeName = async () => {
    // const employeeName = await AsyncStorage.getItem('employeeName');
    const secureData = await getSecureData();
    const employeeName = secureData?.employeeName;
    return employeeName;
  };

  const getRoleDescription = async () => {
    // const roleDescription = await AsyncStorage.getItem('roleDescription');
    const secureData = await getSecureData();
    const roleDescription = secureData?.roleDescription;
    return roleDescription;
  };

  useEffect(() => {
    console.log('contexttttttttt', employeeId);

    if (!employeeId) {
      console.log('tttttttttt');

      getEmployeeId().then(result => {
        if (result) {
          console.log('rrrrrr', result);

          setEmployeeId(result);
        }
      });
    }

    if (!employeeName) {
      getEmployeeName().then(result => {
        if (result) {
          setEmployeeName(result);
        }
      });
    }

    if (!roleDescription) {
      getRoleDescription().then(result => {
        if (result) {
          setRoleDescription(result);
        }
      });
    }
  }, []);

  return (
    <EmployeeDetailsContext.Provider
      value={{
        employeeId,
        employeeName,
        roleDescription,
        SaveEmployeeId,
        SaveEmployeeName,
        SaveRoleDescription,
        ResetEmployeeDetails,
      }}>
      {children}
    </EmployeeDetailsContext.Provider>
  );
};

export const useEmployeeDetails = (): EmployeeDetailsContextTypes =>
  useContext(EmployeeDetailsContext);
