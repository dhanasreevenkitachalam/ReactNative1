import React, { Component } from 'react';
import { ScrollView, Text, View ,FlatList,Modal,StyleSheet} from 'react-native';
import { Card,Icon ,Rating, Input,Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postComments, postFavorite } from '../redux/ActionCreators';


const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites:state.favorites
    }
  }
  const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComments:(dishId,rating,author,comment)=>dispatch(postComments(dishId,rating,author,comment))
})

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
            showModal:false,
            author:'',
            rating:'',
            comment:''

        }
       
    }
    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }
    static navigationOptions = {
        title: 'Dish Details'
    };
    toggleModal=() =>{
        this.setState({showModal: !this.state.showModal});
    }
    handleComment() {
        const dishId = this.props.navigation.getParam('dishId','');
      this.props.postComments(dishId,this.state.rating,this.state.author,this.state.comment)
      console.log(this.state)
        this.toggleModal();
    }
    

    render() {

        
function RenderDish(props) {

    const dish = props.dish;
    
        if (dish != null) {
            return(
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <Icon
                    raised
                    reverse
                    name={ props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                        <Icon
                    raised
                    reverse
                    name={'pencil'}
                    type='font-awesome'
                    color='#512DA8'
                   onPress={()=>props.onPress()}
                    />
                </Card>
            );
        }
        else {
            return(<View></View>);
        }
}
        const dishId = this.props.navigation.getParam('dishId','');
        return(

            <ScrollView>
            <RenderDish dish={this.props.dishes.dishes[+dishId]} 
                 favorite={this.props.favorites.some(el => el === dishId)}
                  onPress={() => {this.markFavorite(dishId);
                this.toggleModal()}}/>
            <RenderComments comments={this.props.comments.comments.filter((comment)=> comment.dishId===dishId)}/>
            <Modal animationType="slide" transparent={false}   visible = {this.state.showModal}
                   onDismiss = {() => this.toggleModal() }
                   onRequestClose = {() => this.toggleModal() }>
                       
                       <Rating  showRating onFinishRating={(value) => this.setState({rating: value})} value={this.state.rating} style={{ paddingVertical: 10 }} onChangeText={(value) => this.setState({rating: value})} value={this.state.rating}/>
                       <View style={StyleSheet.formRow}>
                       <Input placeholder=' Author' name='author' leftIcon={  <Icon  name={'user'} type='font-awesome'  />} 
                        onChangeText={(value) => this.setState({author: value})} value={this.state.author}/>
           
                       </View>
                        <View style={StyleSheet.formRow}>
                    <Input placeholder=' Comments' name='comment' leftIcon={  <Icon  name={'comment'} type='font-awesome' />}
                     onChangeText={(value) => this.setState({comment: value})} value={this.state.comment}/>
                     
                    </View>

                    <View style={styles.modalText} >
                    <Button
                    onPress={() => this.handleComment()}
                    title="Submit"
                    color="#512DA8"
                    accessibilityLabel="Learn more about this purple button"
                    />

                    </View>
                    <View style={styles.modalText}>

                    <Button
                    onPress={() => this.toggleModal()}
                    title="Cancel"
                    color="#D3D3D3"
                    accessibilityLabel="Learn more about this grey button"
                    />
                    </View>
            </Modal>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         backgroundColor: '#512DA8',
         textAlign: 'center',
         color: 'white',
         marginBottom: 20
     },
     modalText: {
         fontSize: 18,
         margin: 10
     }
     
});
export default connect(mapStateToProps,mapDispatchToProps)(Dishdetail);