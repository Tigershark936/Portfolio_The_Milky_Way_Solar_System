import styles from './HomePage.module.scss';
import SolarSystem from '../../components/SolarSystem/SolarSystem';

function HomePage() {
  return (
    <div className={styles.homePage}>
      <div>
        <SolarSystem />
      </div>
    </div>
  );
}

export default HomePage;
