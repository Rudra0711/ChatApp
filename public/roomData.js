class roomData{

  constructor(){
    this.users=[];
  }

  addUser(id,user,room){
    var newUser={id,user,room};
    this.users=this.users.filter((user) => {

      return user.user!==newUser.user;
    });

      this.users.push(newUser);

      return this.users;
  }

  removeUser(id){
    this.users= this.users.filter((user) => {
        return user.id!==id;
    });
    return this.users;
  }

  getUser(id){
    var user=this.users.filter((users) => {
      if(users.id===id){return users.user;}
    });
    var name=user.map((user) => {
      return user.user;
    });

    return name;
  }

  getUserList(room){

    var users= this.users.filter((user) => {

        return user.room===room;
    });
    var userNames=users.map((user) => {
      return user.user;
    });
    return userNames;
  }
}

module.exports = {roomData};
