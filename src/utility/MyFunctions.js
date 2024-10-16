
import { PermissionsAndroid } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
export function sliceTitle(str = '', lastIndex = 30) {
    if (typeof str != 'string') {
        return ''
    }

    if (str?.length > lastIndex) {
        return str?.slice(0, lastIndex) + '...'
    }
    else {
        return str
    }

}

export const TYPE = {

    COURSE: 1,
    PRODUCT: 2,
    isCourse:
        function (param) {
            return param == 1
        }
}

export function removeNull(str = '') {

    if (typeof str !== 'string') return ''; // Handle non-string inputs

    // Split the string by commas
    let parts = str.split(',');

    // Filter out nulls, undefined, and empty strings
    let filteredParts = parts.filter(part => {
        let trimmedPart = part.trim().toLowerCase();
        return trimmedPart && trimmedPart !== 'null' && trimmedPart !== 'undefined';
    });

    // Join the parts back together with commas
    let cleanedAddress = filteredParts.join(', ');

    return cleanedAddress;

}

export const requestDownloadingPermission = async (link) => {
    if (Platform.OS == 'ios') {
        // downloadInvoice();
        downloadFile(link)
    } else {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Downloading Permission',
                    message:
                        'PlasmaPen needs access to your downloading manager ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );

            // const folder = await RNFetchBlob.fs.exists(RNFetchBlob.fs.dirs.DownloadDir); //check Download directory check
            // console.log({folder}, RNFetchBlob.fs.dirs.DownloadDir);
            
            // if (!folder) {
            //     //code download logic
            // }

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // downloadInvoice();
                downloadFile(link)
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

};
function downloadFile(link) {

    console.log('downloadFile', { link });

    // setLoading(true);
    const date = new Date();
    let pdfUrl = link;
    let ext = 'pdf';
    ext = '.' + ext;
    let DownloadDir =
        Platform.OS == 'ios'
            ? RNFetchBlob.fs.dirs.DocumentDir
            :
            RNFetchBlob.fs.dirs.DownloadDir
    // RNFetchBlob.fs.dirs.DCIMDir;
    const { dirs } = RNFetchBlob.fs;
    const dirToSave =
        Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    // Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DCIMDir;
    const configfb = {
        fileCache: true,
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: 'PlasmaPen',
        path: `${dirToSave}/${Math.floor(date.getTime() + date.getSeconds() / 2) + ext
            }`,
    };
    console.log({ DownloadDir, dirToSave });

    const configOptions = Platform.select({
        ios: {
            fileCache: configfb.fileCache,
            title: configfb.title,
            path: configfb.path,
            appendExt: ext,
        },
        android: configfb,
    });
    Platform.OS == 'android'
        ? RNFetchBlob.config({
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path:
                    `${DownloadDir}/` +
                    `${Math.floor(date.getDate() + date.getSeconds() / 2)}` +
                    ext,
                description: 'PlasmaPen',
                title: `${pdfUrl.slice(pdfUrl.lastIndexOf('/'), pdfUrl.length)}`,
                mime: 'application/pdf',
                mediaScannable: true,
            },
        })
            .fetch('GET', `${pdfUrl}`)
            .then(res => {
                // setLoading(false);
            })
            .catch(error => {
                // setLoading(false);
                console.warn(error.message);
            })
        : RNFetchBlob.config(configOptions)
            .fetch('GET', `${pdfUrl}`, {})
            .then(res => {
                // setLoading(false);
                if (Platform.OS === 'ios') {
                    RNFetchBlob.fs.writeFile(
                        configfb.path,
                        res.data,
                        'base64',
                    );
                    RNFetchBlob.ios.previewDocument(configfb.path);
                }
            })
            .catch(e => {
                // setLoading(false);
                console.error('The file saved to ERROR', e.message);
            });
};