import '@testing-library/jest-native/extend-expect';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useFocusEffect: jest.fn(),
}));

// Mock redux hooks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Mock react-native-image-picker
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

// Mock react-native-fs
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: 'document-directory-path',
  ExternalDirectoryPath: 'external-directory-path',
  ExternalStorageDirectoryPath: 'external-storage-directory-path',
  TemporaryDirectoryPath: 'temporary-directory-path',
  LibraryDirectoryPath: 'library-directory-path',
  PicturesDirectoryPath: 'pictures-directory-path',
  CachesDirectoryPath: 'caches-directory-path',
  RNFS: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    unlink: jest.fn(),
    exists: jest.fn(),
    mkdir: jest.fn(),
    readDir: jest.fn(),
    moveFile: jest.fn(),
    copyFile: jest.fn(),
  },
})); 