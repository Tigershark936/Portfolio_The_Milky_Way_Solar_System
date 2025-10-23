import styles from './HomePage.module.scss';

function HomePage() {
  return (
    <div className={styles.homePage}>
      <div>
        <h1 className={styles.title}>🚀 Portfolio Solaire</h1>
        <p className={styles.subtitle}>Bienvenue dans l'espace !</p>
      </div>
    </div>
  );
}

export default HomePage;
