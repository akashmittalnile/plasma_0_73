///*****************************************/////////
///*****************************************/////////
// ----- Developed By Aditya Gupta ----- /////////////
///////////// Nile Technologies PVT Ltd./////////////
///*****************************************/////////
///*****************************************/////////


import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

function useHideBottomTab() {
    const navigation = useNavigation();

    useEffect(() => {
        const parentNavigation = navigation.getParent();

        if (parentNavigation) {
            parentNavigation.setOptions({ tabBarStyle: { display: 'none' }
                , tabBarVisible: false 
            });
        }

        return () => {
            if (parentNavigation) {
                parentNavigation.setOptions({ tabBarStyle: undefined
                    , tabBarVisible: undefined 
                });
            }
        };
    }, [navigation]);
}

export default useHideBottomTab;
