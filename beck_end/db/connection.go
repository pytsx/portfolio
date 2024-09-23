package db

import (
	"database/sql"
	"fmt"

	"github.com/pytsx/beck_end/config"
)

func OpenConnection() (*sql.DB, error) {
	dbcfg := config.GetDB()

	strcnn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbcfg.Host,
		dbcfg.Port,
		dbcfg.User,
		dbcfg.Pass,
		dbcfg.Database,
	)

	conn, err := sql.Open("postgres", strcnn)
	if err != nil {
		panic(err) // todo: lidar com o erro 
	}

	err = conn.Ping()

	return conn, err 
}