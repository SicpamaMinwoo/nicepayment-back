const { Model, Op } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Users.init(
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            nickname: {
                type: DataTypes.STRING,
            },
            gender: {
                type: DataTypes.STRING,
            },
            password: {
                type: DataTypes.STRING(300),
            },
            payment_password: {
                allowNull: true,
                type: DataTypes.STRING(300),
            },
            name: {
                type: DataTypes.STRING(200),
            },
            email: {
                type: DataTypes.STRING(300),
                validate: {
                    isEmail: true,
                },
            },
            phone_code: {
                type: DataTypes.STRING(10),
            },
            phone_number: {
                type: DataTypes.STRING(20),
            },
            date_of_birth: {
                type: DataTypes.DATEONLY,
            },
            profile_photo: {
                type: DataTypes.STRING(2000),
            },
            visiting_count: {
                type: DataTypes.INTEGER,
            },
            created_at: {
                allowNull: false,
                type: 'TIMESTAMP',
            },
            updated_at: {
                allowNull: false,
                type: 'TIMESTAMP',
                defaultValue: DataTypes.NOW,
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Users',
            tableName: 'users',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            paranoid: true,
            deletedAt: 'deleted_at',
            defaultScope: {
                attributes: { exclude: ['password', 'payment_password'] },
            },
        }
    );

    // Hook
    Users.beforeCreate(async (customer) => {
        const hashedPassword = await bcrypt.hash(customer.password, 8);
        customer.password = hashedPassword;
    });

    // Instance methods
    Users.isEmailTaken = async function (email, excludeUserId = null) {
        const customer = await this.findOne({
            where: [{ email }, { id: { [Op.not]: excludeUserId } }],
        });

        return !!customer;
    };

    Users.prototype.isPasswordMatch = async function (password) {
        const customer = this;

        return bcrypt.compare(password, customer.password);
    };
    return Users;
};
