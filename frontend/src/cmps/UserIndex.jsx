import PersonalInfoIcon from "@mui/icons-material/PermIdentityOutlined";
import WorkingStatusIcon from "@mui/icons-material/BusinessCenterOutlined";
import NotificationIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LanguageAndRegionIcon from "@mui/icons-material/PublicOutlined";
import PasswordIcon from "@mui/icons-material/LockOutlined";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/PhoneIphoneOutlined";
import LocationIcon from "@mui/icons-material/LocationOnOutlined";
import BirthdayIcon from '@mui/icons-material/RedeemOutlined';
import WorkAnniversaryIcon from '@mui/icons-material/CalendarTodayOutlined';

export function UserIndex() {
  return (
    <div>
      <h1>Profile</h1>
      <section>
        <nav>
          <section>
            <PersonalInfoIcon />
            <p>Personal info</p>
          </section>
          {/* <section>
            <WorkingStatusIcon />
            <p>Working status</p>
          </section>
          <section>
            <NotificationIcon />
            <p>Notification</p>
          </section>
          <section>
            <LanguageAndRegionIcon />
            <p>Language & region</p>
          </section>
          <section>
            <PasswordIcon />
            <p>Password</p>
          </section>
          <section>
            <NotificationIcon />
            <p>Notification</p>
          </section> */}
        </nav>
      </section>
      <section>
        <section>
          <section>
            <img src="" />
            <section>
              <h2>אדם דויד אפרתי</h2>
              <input placeholder="Add a job title" />
            </section>
          </section>
          <section>
            <div>
              <div>
                <EmailIcon />
                <p>Email</p>
                <input placeholder="Add an email" />
              </div>
            </div>
            <div>
              <div>
                <PhoneIcon />
                <p>Phone</p>
                <input placeholder="Add a phone" />
              </div>
            </div>
            <div>
              <div>
                <PhoneIcon />
                <p>Mobile phone</p>
                <input placeholder="Add a mobile phone" />
              </div>
            </div>
            <div>
              <div>
                <LocationIcon />
                <p>Location</p>
              </div>
              <input placeholder="Add a location" />
            </div>
          </section>
        </section>
        <section>
            <div>
                <div>
                    <i></i>
                    <p>Discord</p>
                </div>
                <input placeholder="Add a discord" />
            </div>
            <div>
                <div>
                    <BirthdayIcon />
                    <input placeholder="Add a birthday" />
                </div>
            </div>
            <div>
                <div>
                    <WorkAnniversaryIcon />
                    <input placeholder="Add a work anniversary" />
                </div>
            </div>
        </section>
        <section>
            <h1>Blah Blah Blah</h1>
        </section>
      </section>
    </div>
  );
}
