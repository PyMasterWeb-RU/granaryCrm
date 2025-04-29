import React from 'react';
import { useSelector, useDispatch } from '@/store/hooks';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import {
  isEdit,
  UpdateContact,
  DeleteContact,
  toggleStarredContact,
} from '@/store/apps/contacts/ContactSlice';
import BlankCard from '../../shared/BlankCard';
import { ContactType } from '../../../(DashboardLayout)/types/apps/contact';
import {
  IconPencil,
  IconStar,
  IconTrash,
  IconDeviceFloppy,
} from '@tabler/icons-react';
import Scrollbar from '../../../components/custom-scroll/Scrollbar';
import Image from 'next/image';

const ContactDetails = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const warningColor = theme.palette.warning.main;

  // 1) все хук-вызовы идут здесь, на верхнем уровне
  const contactDetail = useSelector(
    (state) =>
      state.contactsReducer.contacts[
        state.contactsReducer.contactContent - 1
      ]
  ) as ContactType | undefined;

  const editContact = useSelector(
    (state) => state.contactsReducer.editContact
  );

  // если нет выбранного контакта — отрисуем плейсхолдер и не уйдём глубже
  if (!contactDetail) {
    return (
      <Box
        p={3}
        height="50vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box textAlign="center">
          <Typography variant="h4">Please Select a Contact</Typography>
          <Image
            src="/images/breadcrumb/emailSv.png"
            alt="emailIcon"
            width={250}
            height={250}
          />
        </Box>
      </Box>
    );
  }

  // 2) дальше можно делать любые вычисления
  const idNum = Number(contactDetail.id);

  const tableData = [
    { id: 1, title: 'Firstname', alias: 'firstname' as const, gdata: contactDetail.firstname, type: 'text' as const },
    { id: 2, title: 'Lastname',  alias: 'lastname'  as const, gdata: contactDetail.lastname,  type: 'text' as const },
    { id: 3, title: 'Company',   alias: 'company'   as const, gdata: contactDetail.company,   type: 'text' as const },
    { id: 4, title: 'Department',alias: 'department'as const, gdata: contactDetail.department,type: 'text' as const },
    { id: 5, title: 'Email',     alias: 'email'     as const, gdata: contactDetail.email,     type: 'email' as const },
    { id: 6, title: 'Phone',     alias: 'phone'     as const, gdata: contactDetail.phone,     type: 'phone' as const },
    { id: 7, title: 'Address',   alias: 'address'   as const, gdata: contactDetail.address,   type: 'text' as const },
    { id: 8, title: 'Notes',     alias: 'notes'     as const, gdata: contactDetail.notes,     type: 'text' as const },
  ];

  return (
    <>
      {/* Header */}
      <Box p={3} py={2} display="flex" alignItems="center">
        <Typography variant="h5">Contact Details</Typography>
        <Stack direction="row" gap={1} ml="auto">
          <Tooltip title={contactDetail.starred ? 'Unstar' : 'Star'}>
            <IconButton onClick={() => dispatch(toggleStarredContact(idNum))}>
              <IconStar
                stroke={1.3}
                size={18}
                style={{
                  fill: contactDetail.starred ? warningColor : undefined,
                  stroke: contactDetail.starred ? warningColor : undefined,
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={editContact ? 'Save' : 'Edit'}>
            <IconButton onClick={() => dispatch(isEdit())}>
              {editContact ? (
                <IconDeviceFloppy size={18} stroke={1.3} />
              ) : (
                <IconPencil size={18} stroke={1.3} />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => dispatch(DeleteContact(idNum))}>
              <IconTrash size={18} stroke={1.3} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      <Divider />

      {/* Details / Edit */}
      <Box sx={{ overflow: 'auto' }}>
        {!editContact ? (
          <Box>
            <Box p={3}>
              <Box display="flex" alignItems="center">
                <Avatar
                  alt={`${contactDetail.firstname} ${contactDetail.lastname}`}
                  src={contactDetail.image}
                  sx={{ width: 72, height: 72 }}
                />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6" mb={0.5}>
                    {contactDetail.firstname} {contactDetail.lastname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={0.5}>
                    {contactDetail.department}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {contactDetail.company}
                  </Typography>
                </Box>
              </Box>

              <Grid container>
                <Grid size={{ xs: 12, lg: 6 }} sx={{ mt: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    {contactDetail.phone}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }} sx={{ mt: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email address
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    {contactDetail.email}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, lg: 12 }} sx={{ mt: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    {contactDetail.address}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }} sx={{ mt: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    {contactDetail.department}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }} sx={{ mt: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Company
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    {contactDetail.company}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, lg: 12 }} sx={{ mt: 4 }}>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Notes
                  </Typography>
                  <Typography variant="subtitle1" mb={0.5}>
                    {contactDetail.notes}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <Box p={3} sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={() => dispatch(isEdit())}
              >
                Edit
              </Button>
              <Button
                color="error"
                variant="contained"
                size="small"
                onClick={() => dispatch(DeleteContact(idNum))}
              >
                Delete
              </Button>
            </Box>
          </Box>
        ) : (
          <BlankCard sx={{ p: 0 }}>
            <Scrollbar sx={{ height: { lg: 'calc(100vh - 360px)', md: '100vh' } }}>
              <Box pt={1}>
                {tableData.map((data) => (
                  <Box key={data.id} px={3} py={1.5}>
                    <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                      {data.title}
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      type={data.type}
                      value={data.gdata}
                      onChange={(e) =>
                        dispatch(UpdateContact(idNum, data.alias, e.target.value))
                      }
                    />
                  </Box>
                ))}
                <Box p={3}>
                  <Button color="primary" variant="contained" onClick={() => dispatch(isEdit())}>
                    Save Contact
                  </Button>
                </Box>
              </Box>
            </Scrollbar>
          </BlankCard>
        )}
      </Box>
    </>
  );
};

export default ContactDetails;
