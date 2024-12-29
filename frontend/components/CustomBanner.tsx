import { getApiUrl } from '@/utils/debug';
import * as React from 'react';
import { Banner } from 'react-native-paper';

const CustomBanner = () => {
  const [visible, setVisible] = React.useState(true);

  const text = `Backend API: ${getApiUrl()}`;

  return (
    <Banner
      visible={visible}
      actions={[
        {
          label: 'Hide',
          onPress: () => setVisible(false),
        },
      ]}
    >
      {text}
    </Banner>
  );
};

export default CustomBanner;