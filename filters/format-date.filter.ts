import moment from 'moment';

export const formatDate = (value: any) => {
    if (value) {
     return moment(value).format('MM/DD/YYYY hh:mm');
    }
};
