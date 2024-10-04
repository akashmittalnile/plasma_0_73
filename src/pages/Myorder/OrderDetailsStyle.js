import * as Colors from './Colors'
import {Platform, StyleSheet} from 'react-native';
// import {width} from '../../../global/Constant';
import { dimensions, Mycolors } from '../../utility/Mycolors';

const width = dimensions.SCREEN_WIDTH

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SCREEN_BG,
  },
  mainView: {
    padding: 20,
    paddingTop: 0,
    // marginTop: -30,
  },
  courseContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 11,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  courseTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: Colors.THEME_BROWN,
  },
  courseSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crseImg: {
    height: 99,
    width: width * 0.33,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crtrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // marginLeft: 22,
    width: '80%',
    // backgroundColor: 'red'
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createImgStyle: {
    height: 13,
    width: 13,
    borderRadius: 13 / 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  summaryContainer: {
    padding: 12,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 5,
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountContainer: {
    backgroundColor: Mycolors.Purple,
    overflow: 'hidden',
    width: '100%',
    borderRadius: 10,
    height: 96,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 13,
    paddingHorizontal: 10,
  },
  whiteCircle2: {
    borderRadius: (17.15 * 2) / 2,
    width: 17.15 * 2,
    height: 17.15 * 2,
    backgroundColor: 'rgba(224, 178, 32, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteCircle3: {
    borderRadius: (29 * 2) / 2,
    width: 29 * 2,
    height: 29 * 2,
    backgroundColor: '#653C3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  cardContainerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
